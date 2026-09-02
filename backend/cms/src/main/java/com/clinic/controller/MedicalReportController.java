package com.clinic.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.clinic.dto.AuthResponse;
import com.clinic.entity.MedicalReport;
import com.clinic.service.MedicalReportService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/reports")
public class MedicalReportController {

    @Autowired
    private MedicalReportService medicalReportService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadReport(
            @RequestParam Long patientId,
            @RequestParam String reportType,
            @RequestParam(required = false) String notes,
            @RequestParam("file") MultipartFile file) {
        try {
            MedicalReport report = medicalReportService.uploadReport(
                    patientId, reportType, notes, file);
            return ResponseEntity.ok(report);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to store file");
        }
    }

    @GetMapping
    public List<MedicalReport> getAllMedicalReports() {
        return medicalReportService.getAllMedicalReports();
    }

    @GetMapping("/patient/{patientId}")
    public List<MedicalReport> getReportsByPatient(@PathVariable Long patientId) {
        return medicalReportService.getReportsByPatientId(patientId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalReport> getMedicalReportById(@PathVariable Long id, HttpServletRequest request) {
        MedicalReport report = medicalReportService.getMedicalReportById(id);
        if (report == null) {
            return ResponseEntity.notFound().build();
        }
        if (!canPatientAccess(request, report.getPatientId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(report);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadReport(@PathVariable Long id, HttpServletRequest request) throws IOException {
        MedicalReport report = medicalReportService.getMedicalReportById(id);
        if (report == null) {
            return ResponseEntity.notFound().build();
        }
        if (!canPatientAccess(request, report.getPatientId())) {
            return ResponseEntity.status(403).build();
        }

        Resource resource = medicalReportService.loadReportFile(id);
        if (resource == null) {
            return ResponseEntity.notFound().build();
        }

        MediaType mediaType = medicalReportService.resolveMediaType(report.getFilePath());
        String fileName = medicalReportService.getOriginalDownloadName(report);

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateMedicalReport(
            @PathVariable Long id,
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) String reportType,
            @RequestParam(required = false) String notes,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            MedicalReport updated = medicalReportService.updateMedicalReport(
                    id, patientId, reportType, notes, file);
            if (updated == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Failed to update report");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicalReport(@PathVariable Long id) throws IOException {
        MedicalReport report = medicalReportService.getMedicalReportById(id);
        if (report == null) {
            return ResponseEntity.notFound().build();
        }
        medicalReportService.deleteMedicalReport(id);
        return ResponseEntity.ok("Medical Report Deleted Successfully");
    }

    private boolean canPatientAccess(HttpServletRequest request, Long resourcePatientId) {
        AuthResponse session = (AuthResponse) request.getAttribute("authSession");
        if (session == null || !"PATIENT".equals(session.getRole())) {
            return true;
        }
        return session.getPatientId() != null && session.getPatientId().equals(resourcePatientId);
    }
}
