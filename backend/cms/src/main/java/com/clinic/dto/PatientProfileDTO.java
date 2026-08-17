package com.clinic.dto;

import java.util.List;

import com.clinic.entity.Appointment;
import com.clinic.entity.MedicalReport;
import com.clinic.entity.Patient;
import com.clinic.entity.Prescription;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PatientProfileDTO {

    private Patient patient;
    private List<Appointment> appointments;
    private List<Prescription> prescriptions;
    private List<MedicalReport> reports;
    private String medicalSummary;
}
