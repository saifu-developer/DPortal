package com.clinic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.clinic.dto.AuthResponse;
import com.clinic.dto.DoctorLoginRequest;
import com.clinic.dto.OtpSendRequest;
import com.clinic.dto.OtpVerifyRequest;
import com.clinic.dto.StaffLoginRequest;
import com.clinic.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/otp/send")
    public ResponseEntity<AuthResponse> sendOtp(@Valid @RequestBody OtpSendRequest request) {
        return ResponseEntity.ok(authService.sendOtp(request.getEmail()));
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request.getEmail(), request.getOtp()));
    }

    @PostMapping("/staff/login")
    public ResponseEntity<AuthResponse> staffLogin(@RequestBody StaffLoginRequest request) {
        return ResponseEntity.ok(authService.staffLogin(request.getUsername(), request.getPassword()));
    }

    @PostMapping("/doctor/login")
    public ResponseEntity<AuthResponse> doctorLogin(@RequestBody DoctorLoginRequest request) {
        return ResponseEntity.ok(authService.doctorLogin(request.getUsername(), request.getPassword()));
    }

    @GetMapping("/validate")
    public ResponseEntity<AuthResponse> validate(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader != null && authHeader.startsWith("Bearer ")
                ? authHeader.substring(7) : null;
        return ResponseEntity.ok(authService.validateToken(token));
    }
}
