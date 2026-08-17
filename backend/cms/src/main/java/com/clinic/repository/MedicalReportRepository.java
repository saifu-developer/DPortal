package com.clinic.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.clinic.entity.MedicalReport;

public interface MedicalReportRepository extends JpaRepository<MedicalReport, Long> {

    List<MedicalReport> findByPatient_IdOrderByUploadDateDesc(Long patientId);
}
