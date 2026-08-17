package com.clinic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.clinic.entity.Prescription;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    List<Prescription> findByPatient_IdOrderByPrescribedDateDesc(Long patientId);

    Optional<Prescription> findByAppointment_Id(Long appointmentId);
}
