package com.clinic.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.clinic.entity.MedicalReport;
import com.clinic.repository.MedicalReportRepository;
import com.clinic.repository.PatientRepository;

@Service
public class MedicalReportService {

    @Autowired
    private MedicalReportRepository medicalReportRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public MedicalReport uploadReport(Long patientId, String reportType,
                                      String notes, MultipartFile file) throws IOException {

        String storedFileName = fileStorageService.store(file);

        MedicalReport report = new MedicalReport();
        report.setPatientId(patientId);
        resolvePatient(report);
        report.setReportName(resolveReportName(file, reportType));
        report.setReportType(reportType);
        report.setNotes(notes);
        report.setUploadDate(LocalDate.now());
        report.setFilePath(storedFileName);

        return medicalReportRepository.save(report);
    }

    public List<MedicalReport> getAllMedicalReports() {
        return medicalReportRepository.findAll();
    }

    public MedicalReport getMedicalReportById(Long id) {
        return medicalReportRepository.findById(id).orElse(null);
    }

    public List<MedicalReport> getReportsByPatientId(Long patientId) {
        return medicalReportRepository.findByPatient_IdOrderByUploadDateDesc(patientId);
    }

    public MedicalReport updateMedicalReport(Long id, Long patientId, String reportType,
                                             String notes, MultipartFile file) throws IOException {

        MedicalReport existing = medicalReportRepository.findById(id).orElse(null);
        if (existing == null) {
            return null;
        }

        if (patientId != null) {
            existing.setPatientId(patientId);
            resolvePatient(existing);
        }
        if (reportType != null) {
            existing.setReportType(reportType);
            if (file == null || file.isEmpty()) {
                existing.setReportName(reportType + " Report");
            }
        }
        if (notes != null) {
            existing.setNotes(notes);
        }

        if (file != null && !file.isEmpty()) {
            fileStorageService.delete(existing.getFilePath());
            existing.setFilePath(fileStorageService.store(file));
            existing.setReportName(resolveReportName(file, existing.getReportType()));
            existing.setUploadDate(LocalDate.now());
        }

        return medicalReportRepository.save(existing);
    }

    public void deleteMedicalReport(Long id) throws IOException {
        MedicalReport report = medicalReportRepository.findById(id).orElse(null);
        if (report != null) {
            fileStorageService.delete(report.getFilePath());
            medicalReportRepository.deleteById(id);
        }
    }

    public Resource loadReportFile(Long id) throws IOException {
        MedicalReport report = medicalReportRepository.findById(id).orElse(null);
        if (report == null || report.getFilePath() == null) {
            return null;
        }

        Path filePath = fileStorageService.load(report.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            return null;
        }
        return resource;
    }

    public MediaType resolveMediaType(String filePath) {
        if (filePath == null) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
        String lower = filePath.toLowerCase();
        if (lower.endsWith(".pdf")) {
            return MediaType.APPLICATION_PDF;
        }
        if (lower.endsWith(".png")) {
            return MediaType.IMAGE_PNG;
        }
        if (lower.endsWith(".gif")) {
            return MediaType.IMAGE_GIF;
        }
        if (lower.endsWith(".webp")) {
            return MediaType.parseMediaType("image/webp");
        }
        return MediaType.IMAGE_JPEG;
    }

    public String getOriginalDownloadName(MedicalReport report) {
        String extension = "";
        int dot = report.getFilePath().lastIndexOf('.');
        if (dot >= 0) {
            extension = report.getFilePath().substring(dot);
        }
        String safeName = report.getReportName().replaceAll("[^a-zA-Z0-9-_ ]", "").trim();
        return (safeName.isEmpty() ? "report" : safeName.replace(' ', '_')) + extension;
    }

    private String resolveReportName(MultipartFile file, String reportType) {
        String originalName = StringUtils.cleanPath(file.getOriginalFilename());
        if (originalName.contains(".")) {
            originalName = originalName.substring(0, originalName.lastIndexOf('.'));
        }
        if (originalName.isBlank()) {
            return reportType + " Report";
        }
        return originalName;
    }

    private void resolvePatient(MedicalReport report) {
        if (report.getPatientId() != null) {
            report.setPatient(patientRepository.getReferenceById(report.getPatientId()));
        }
    }
}
