package com.clinic.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.clinic.entity.Appointment;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatient_IdOrderByAppointmentDateDesc(Long patientId);

    boolean existsByAppointmentDateAndAppointmentTimeAndStatus(
            LocalDate appointmentDate, LocalTime appointmentTime, String status);

    List<Appointment> findByAppointmentDateAndStatus(LocalDate appointmentDate, String status);
}
