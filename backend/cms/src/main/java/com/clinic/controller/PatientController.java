package com.clinic.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.clinic.dto.PatientProfileDTO;
import com.clinic.entity.Patient;
import com.clinic.service.PatientProfileService;
import com.clinic.service.PatientService;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private PatientProfileService patientProfileService;

    @PostMapping
    public Patient savePatient(@RequestBody Patient patient) {
        return patientService.savePatient(patient);
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/search")
    public ResponseEntity<Patient> searchPatient(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String mobile) {
        Patient patient = null;
        if (code != null && !code.isBlank()) {
            patient = patientProfileService.findByPatientCode(code.trim());
        } else if (mobile != null && !mobile.isBlank()) {
            patient = patientProfileService.findByMobile(mobile.trim());
        }
        if (patient == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/{id}")
    public Patient getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id);
    }

    @GetMapping("/{id}/profile")
    public PatientProfileDTO getPatientProfile(@PathVariable Long id) {
        return patientProfileService.getPatientProfile(id);
    }

    @DeleteMapping("/{id}")
    public String deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return "Patient Deleted Successfully";
    }

    @PutMapping("/{id}")
    public Patient updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        return patientService.updatePatient(id, patient);
    }
}
