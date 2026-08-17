package com.clinic.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "medical_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MedicalReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    @JsonIgnore
    private Patient patient;

    private String reportName;

    private String reportType;

    private LocalDate uploadDate;

    private String filePath;

    @Column(columnDefinition = "TEXT")
    private String notes;

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
}
