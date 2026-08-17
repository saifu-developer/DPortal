package com.clinic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.clinic.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByMobile(String mobile);

    Optional<Patient> findByEmail(String email);

    Optional<Patient> findByPatientCode(String patientCode);
}
