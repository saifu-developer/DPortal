package com.clinic.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    @JsonIgnore
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    @JsonIgnore
    private Doctor doctor;

    private LocalDate appointmentDate;

    private LocalTime appointmentTime;

    private String symptoms;

    private String status;

    private LocalDateTime completedAt;

    @JsonProperty("patientId")
    public Long getPatientId() {
        return patient != null ? patient.getId() : null;
    }

    @JsonProperty("patientId")
    public void setPatientId(Long patientId) {
        if (patientId == null) {
            this.patient = null;
        } else {
            Patient p = new Patient();
            p.setId(patientId);
            this.patient = p;
        }
    }

    @JsonProperty("doctorId")
    public Long getDoctorId() {
        return doctor != null ? doctor.getId() : null;
    }

    @JsonProperty("doctorId")
    public void setDoctorId(Long doctorId) {
        if (doctorId == null) {
            this.doctor = null;
        } else {
            Doctor d = new Doctor();
            d.setId(doctorId);
            this.doctor = d;
        }
    }
}
