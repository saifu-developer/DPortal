package com.clinic.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinic.dto.PatientProfileDTO;
import com.clinic.entity.Appointment;
import com.clinic.entity.MedicalReport;
import com.clinic.entity.Patient;
import com.clinic.entity.Prescription;
import com.clinic.repository.AppointmentRepository;
import com.clinic.repository.MedicalReportRepository;
import com.clinic.repository.PatientRepository;
import com.clinic.repository.PrescriptionRepository;

@Service
public class PatientProfileService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private MedicalReportRepository medicalReportRepository;

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id).orElse(null);
    }

    public Patient findByMobile(String mobile) {
        return patientRepository.findByMobile(mobile).orElse(null);
    }

    public Patient findByPatientCode(String patientCode) {
        return patientRepository.findByPatientCode(patientCode).orElse(null);
    }

    public PatientProfileDTO getPatientProfile(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        List<Appointment> appointments = appointmentRepository.findByPatient_IdOrderByAppointmentDateDesc(id);
        List<Prescription> prescriptions = prescriptionRepository.findByPatient_IdOrderByPrescribedDateDesc(id);
        List<MedicalReport> reports = medicalReportRepository.findByPatient_IdOrderByUploadDateDesc(id);

        String medicalSummary = buildMedicalSummary(patient, appointments, prescriptions);

        return new PatientProfileDTO(patient, appointments, prescriptions, reports, medicalSummary);
    }

    private String buildMedicalSummary(Patient patient, List<Appointment> appointments, List<Prescription> prescriptions) {
        StringBuilder summary = new StringBuilder();

        if (patient.getMedicalNotes() != null && !patient.getMedicalNotes().isBlank()) {
            summary.append("Notes: ").append(patient.getMedicalNotes());
        }

        if (!prescriptions.isEmpty()) {
            Prescription latest = prescriptions.get(0);
            if (summary.length() > 0) summary.append("\n");
            summary.append("Latest Diagnosis: ").append(latest.getDiagnosis());
            summary.append("\nLatest Medicines: ").append(latest.getMedicines());
        }

        if (!appointments.isEmpty()) {
            Appointment latest = appointments.get(0);
            if (summary.length() > 0) summary.append("\n");
            summary.append("Last Appointment: ").append(latest.getAppointmentDate())
                    .append(" (").append(latest.getStatus()).append(")");
        }

        return summary.length() > 0 ? summary.toString() : "No medical summary available.";
    }
}
