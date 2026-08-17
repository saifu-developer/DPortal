package com.clinic.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clinic.entity.Appointment;
import com.clinic.entity.Prescription;
import com.clinic.repository.AppointmentRepository;
import com.clinic.repository.PatientRepository;
import com.clinic.repository.PrescriptionRepository;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Transactional
    public Prescription savePrescription(Prescription prescription) {
        if (prescription.getAppointmentId() == null) {
            throw new RuntimeException("Prescription must be linked to an appointment");
        }

        Appointment appointment = appointmentRepository.findById(prescription.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if ("COMPLETED".equals(appointment.getStatus())) {
            throw new RuntimeException("Appointment is already completed");
        }

        if (prescriptionRepository.findByAppointment_Id(appointment.getId()).isPresent()) {
            throw new RuntimeException("A prescription already exists for this appointment");
        }

        prescription.setPatientId(appointment.getPatientId());
        resolveRelationships(prescription);
        Prescription saved = prescriptionRepository.save(prescription);

        appointment.setStatus("COMPLETED");
        appointment.setCompletedAt(LocalDateTime.now());
        appointmentRepository.save(appointment);

        return saved;
    }

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Prescription getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id).orElse(null);
    }

    public Prescription updatePrescription(Long id, Prescription prescription) {
        Prescription existingPrescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

        // Keep original links — never orphan a prescription from its appointment/patient
        if (existingPrescription.getAppointmentId() != null) {
            prescription.setAppointmentId(existingPrescription.getAppointmentId());
        }
        if (existingPrescription.getPatientId() != null) {
            prescription.setPatientId(existingPrescription.getPatientId());
        }

        resolveRelationships(existingPrescription);
        existingPrescription.setDiagnosis(prescription.getDiagnosis());
        existingPrescription.setMedicines(prescription.getMedicines());
        existingPrescription.setInstructions(prescription.getInstructions());
        existingPrescription.setPrescribedDate(prescription.getPrescribedDate());

        return prescriptionRepository.save(existingPrescription);
    }

    public void deletePrescription(Long id) {
        prescriptionRepository.deleteById(id);
    }

    public List<Prescription> getPrescriptionsByPatient(Long patientId) {
        return prescriptionRepository.findByPatient_IdOrderByPrescribedDateDesc(patientId);
    }

    private void resolveRelationships(Prescription prescription) {
        if (prescription.getPatientId() != null) {
            prescription.setPatient(
                    patientRepository.getReferenceById(prescription.getPatientId()));
        }
        if (prescription.getAppointmentId() != null) {
            prescription.setAppointment(
                    appointmentRepository.getReferenceById(prescription.getAppointmentId()));
        }
    }
}
