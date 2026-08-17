package com.clinic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.clinic.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

}
