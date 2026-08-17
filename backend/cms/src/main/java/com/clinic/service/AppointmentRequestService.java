package com.clinic.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.clinic.dto.AppointmentRequestCreateRequest;
import com.clinic.dto.SlotAvailabilityResponse;
import com.clinic.entity.Appointment;
import com.clinic.entity.AppointmentRequest;
import com.clinic.entity.Doctor;
import com.clinic.entity.Patient;
import com.clinic.repository.AppointmentRepository;
import com.clinic.repository.AppointmentRequestRepository;
import com.clinic.repository.DoctorRepository;
import com.clinic.repository.PatientRepository;

@Service
public class AppointmentRequestService {

    private static final Logger log = LoggerFactory.getLogger(AppointmentRequestService.class);

    private static final Set<String> ALLOWED_TIME_SLOTS = Set.of(
            "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
            "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
            "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM",
            "07:00 PM", "07:30 PM");

    private static final List<String> OCCUPYING_REQUEST_STATUSES = List.of("PENDING", "APPROVED");

    private static final String OCCUPYING_APPOINTMENT_STATUS = "SCHEDULED";

    private static final String SLOT_CONFLICT_MESSAGE =
            "This time slot is already booked. Please select another time.";

    private static final DateTimeFormatter TIME_SLOT_FORMAT =
            DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH);

    @Autowired
    private AppointmentRequestRepository appointmentRequestRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private EmailService emailService;

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public AppointmentRequest createRequest(AppointmentRequestCreateRequest dto) {
        validatePreferredDate(dto.getPreferredDate());
        validatePreferredTimeSlot(dto.getPreferredTimeSlot());
        ensureSlotAvailable(dto.getPreferredDate(), dto.getPreferredTimeSlot(), null);

        AppointmentRequest request = new AppointmentRequest();
        request.setPatientName(dto.getPatientName().trim());
        request.setMobileNumber(dto.getMobileNumber().trim());
        request.setAge(dto.getAge());
        request.setGender(dto.getGender());
        request.setReasonForVisit(dto.getReasonForVisit().trim());
        request.setPreferredDate(dto.getPreferredDate());
        request.setEmail(dto.getEmail().trim().toLowerCase());
        request.setPreferredTimeSlot(dto.getPreferredTimeSlot());
        request.setStatus("PENDING");

        return appointmentRequestRepository.save(request);
    }

    public SlotAvailabilityResponse getSlotAvailability(LocalDate date) {
        validatePreferredDate(date);

        Set<String> bookedSlots = new LinkedHashSet<>();

        appointmentRequestRepository.findByPreferredDateAndStatusIn(date, OCCUPYING_REQUEST_STATUSES)
                .forEach(request -> bookedSlots.add(request.getPreferredTimeSlot()));

        appointmentRepository.findByAppointmentDateAndStatus(date, OCCUPYING_APPOINTMENT_STATUS)
                .forEach(appointment -> bookedSlots.add(formatTimeSlot(appointment.getAppointmentTime())));

        List<String> availableSlots = ALLOWED_TIME_SLOTS.stream()
                .filter(slot -> !bookedSlots.contains(slot))
                .toList();

        return new SlotAvailabilityResponse(date, new ArrayList<>(bookedSlots), availableSlots);
    }

    public List<AppointmentRequest> getAllRequests() {
        return appointmentRequestRepository.findAllByOrderByIdDesc();
    }

    public long countPending() {
        return appointmentRequestRepository.countByStatus("PENDING");
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public AppointmentRequest approveRequest(Long id) {
        AppointmentRequest request = appointmentRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment request not found"));

        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("Request is not pending");
        }

        ensureSlotAvailable(
                request.getPreferredDate(),
                request.getPreferredTimeSlot(),
                request.getId());

        Patient patient = patientRepository.findByMobile(request.getMobileNumber())
                .orElseGet(() -> {
                    Patient newPatient = new Patient();
                    newPatient.setPatientCode("P" + System.currentTimeMillis() % 100000);
                    newPatient.setFullName(request.getPatientName());
                    newPatient.setMobile(request.getMobileNumber());
                    newPatient.setAge(request.getAge());
                    newPatient.setGender(request.getGender());
                    newPatient.setEmail(normalizeEmail(request.getEmail()));
                    return patientRepository.save(newPatient);
                });

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            patient.setEmail(normalizeEmail(request.getEmail()));
            patient = patientRepository.save(patient);
        }

        Doctor doctor = doctorRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No doctor configured in the system"));

        Appointment appointment = new Appointment();
        appointment.setPatientId(patient.getId());
        appointment.setDoctorId(doctor.getId());
        appointment.setAppointmentDate(request.getPreferredDate() != null
                ? request.getPreferredDate()
                : LocalDate.now());
        appointment.setAppointmentTime(resolveAppointmentTime(request.getPreferredTimeSlot()));
        appointment.setSymptoms(request.getReasonForVisit());
        appointment.setStatus("SCHEDULED");
        appointmentService.saveAppointment(appointment);

        request.setStatus("APPROVED");
        AppointmentRequest saved = appointmentRequestRepository.save(request);
        sendAppointmentApprovedNotification(request, doctor);
        return saved;
    }

    @Transactional
    public AppointmentRequest rejectRequest(Long id) {
        AppointmentRequest request = appointmentRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment request not found"));

        if (!"PENDING".equals(request.getStatus())) {
            throw new RuntimeException("Request is not pending");
        }

        Doctor doctor = doctorRepository.findAll().stream()
                .findFirst()
                .orElse(null);

        request.setStatus("REJECTED");
        AppointmentRequest saved = appointmentRequestRepository.save(request);
        sendAppointmentRejectedNotification(request, doctor);
        return saved;
    }

    private void sendAppointmentApprovedNotification(AppointmentRequest request, Doctor doctor) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return;
        }
        try {
            emailService.sendAppointmentApprovedEmail(
                    request.getEmail(),
                    request.getPatientName(),
                    request.getPreferredDate(),
                    request.getPreferredTimeSlot(),
                    resolveDoctorName(doctor));
        } catch (Exception e) {
            log.error("Failed to send appointment approval email to {}", request.getEmail(), e);
        }
    }

    private void sendAppointmentRejectedNotification(AppointmentRequest request, Doctor doctor) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return;
        }
        try {
            emailService.sendAppointmentRejectedEmail(
                    request.getEmail(),
                    request.getPatientName(),
                    request.getPreferredDate(),
                    request.getPreferredTimeSlot(),
                    resolveDoctorName(doctor));
        } catch (Exception e) {
            log.error("Failed to send appointment rejection email to {}", request.getEmail(), e);
        }
    }

    private String resolveDoctorName(Doctor doctor) {
        if (doctor == null || doctor.getFullName() == null || doctor.getFullName().isBlank()) {
            return "KurePulse Clinic";
        }
        return doctor.getFullName();
    }

    private void ensureSlotAvailable(LocalDate date, String timeSlot, Long excludeRequestId) {
        if (isSlotOccupied(date, timeSlot, excludeRequestId)) {
            throw new IllegalArgumentException(SLOT_CONFLICT_MESSAGE);
        }
    }

    private boolean isSlotOccupied(LocalDate date, String timeSlot, Long excludeRequestId) {
        boolean requestOccupied = excludeRequestId == null
                ? appointmentRequestRepository.existsByPreferredDateAndPreferredTimeSlotAndStatusIn(
                        date, timeSlot, OCCUPYING_REQUEST_STATUSES)
                : appointmentRequestRepository.existsByPreferredDateAndPreferredTimeSlotAndStatusInAndIdNot(
                        date, timeSlot, OCCUPYING_REQUEST_STATUSES, excludeRequestId);

        if (requestOccupied) {
            return true;
        }

        LocalTime appointmentTime = resolveAppointmentTime(timeSlot);
        return appointmentRepository.existsByAppointmentDateAndAppointmentTimeAndStatus(
                date, appointmentTime, OCCUPYING_APPOINTMENT_STATUS);
    }

    private String formatTimeSlot(LocalTime time) {
        if (time == null) {
            return "10:00 AM";
        }
        return TIME_SLOT_FORMAT.format(time);
    }

    private void validatePreferredDate(LocalDate preferredDate) {
        if (preferredDate == null) {
            throw new IllegalArgumentException("Preferred date is required");
        }
        if (preferredDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Preferred date cannot be in the past");
        }
        if (preferredDate.getDayOfWeek() == DayOfWeek.SUNDAY) {
            throw new IllegalArgumentException("Appointments are not available on Sundays");
        }
    }

    private void validatePreferredTimeSlot(String preferredTimeSlot) {
        if (preferredTimeSlot == null || preferredTimeSlot.isBlank()) {
            throw new IllegalArgumentException("Preferred time slot is required");
        }
        if (!ALLOWED_TIME_SLOTS.contains(preferredTimeSlot)) {
            throw new IllegalArgumentException("Selected time slot is outside clinic consultation hours");
        }
    }

    private LocalTime resolveAppointmentTime(String preferredTimeSlot) {
        if (preferredTimeSlot == null || preferredTimeSlot.isBlank()) {
            return LocalTime.of(10, 0);
        }
        return LocalTime.parse(preferredTimeSlot, TIME_SLOT_FORMAT);
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }
        return email.trim().toLowerCase();
    }
}
