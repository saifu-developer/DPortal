package com.clinic.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.clinic.dto.AppointmentRequestCreateRequest;
import com.clinic.dto.SlotAvailabilityResponse;
import com.clinic.entity.AppointmentRequest;
import com.clinic.service.AppointmentRequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/public/appointment-requests")
public class AppointmentRequestController {

    @Autowired
    private AppointmentRequestService appointmentRequestService;

    @GetMapping("/availability")
    public ResponseEntity<SlotAvailabilityResponse> getAvailability(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentRequestService.getSlotAvailability(date));
    }

    @GetMapping("/pending-count")
    public long getPendingCount() {
        return appointmentRequestService.countPending();
    }

    @GetMapping
    public List<AppointmentRequest> getAllRequests() {
        return appointmentRequestService.getAllRequests();
    }

    @PostMapping
    public ResponseEntity<AppointmentRequest> submitRequest(
            @Valid @RequestBody AppointmentRequestCreateRequest request) {
        AppointmentRequest saved = appointmentRequestService.createRequest(request);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<AppointmentRequest> approveRequest(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentRequestService.approveRequest(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<AppointmentRequest> rejectRequest(@PathVariable Long id) {
        return ResponseEntity.ok(appointmentRequestService.rejectRequest(id));
    }
}
