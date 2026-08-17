package com.clinic.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "prescriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    @JsonIgnore
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id")
    @JsonIgnore
    private Appointment appointment;

    private String diagnosis;

    @Column(columnDefinition = "TEXT")
    private String medicines;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    private LocalDate prescribedDate;

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

    @JsonProperty("appointmentId")
    public Long getAppointmentId() {
        return appointment != null ? appointment.getId() : null;
    }

    @JsonProperty("appointmentId")
    public void setAppointmentId(Long appointmentId) {
        if (appointmentId == null) {
            this.appointment = null;
        } else {
            Appointment a = new Appointment();
            a.setId(appointmentId);
            this.appointment = a;
        }
    }
}
