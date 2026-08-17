package com.clinic.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "appointment_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientName;

    private String mobileNumber;

    private Integer age;

    private String gender;

    @Column(columnDefinition = "TEXT")
    private String reasonForVisit;

    private LocalDate preferredDate;

    @Column(length = 255)
    private String email;

    @Column(name = "preferred_time_slot", length = 20)
    private String preferredTimeSlot;

    private String status = "PENDING";
}
