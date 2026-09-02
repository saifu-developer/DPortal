package com.clinic.service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.clinic.dto.AuthResponse;
import com.clinic.entity.Doctor;
import com.clinic.entity.Patient;
import com.clinic.repository.DoctorRepository;
import com.clinic.repository.PatientRepository;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();
    private final Map<String, AuthResponse> tokenStore = new ConcurrentHashMap<>();

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private EmailService emailService;

    @Value("${app.otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    @Value("${app.staff.username}")
    private String staffUsername;

    @Value("${app.staff.password}")
    private String staffPassword;

    @Value("${app.doctor.username}")
    private String doctorUsername;

    @Value("${app.doctor.password}")
    private String doctorPassword;

    public AuthResponse sendOtp(String email) {
        String normalizedEmail = normalizeEmail(email);
        Patient patient = patientRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException(
                        "No patient found with this email address. Please contact the clinic."));

        String otp = generateOtp();
        long expiresAt = System.currentTimeMillis() + (otpExpiryMinutes * 60_000L);
        otpStore.put(normalizedEmail, new OtpEntry(otp, expiresAt));

        log.info("OTP generated for patientId={} email={}", patient.getId(), normalizedEmail);
        try {
            emailService.sendOtpEmail(normalizedEmail, otp, patient.getFullName());
            log.info("OTP email dispatched successfully for email={}", normalizedEmail);
        } catch (Exception ex) {
            otpStore.remove(normalizedEmail);
            log.error(
                    "OTP email send failed for email={}: {} ({})",
                    normalizedEmail,
                    ex.getMessage(),
                    ex.getClass().getName(),
                    ex);
            throw ex;
        }

        return new AuthResponse(null, "PATIENT", patient.getId(), null, patient.getFullName(),
                "OTP sent to your email address. Please check your inbox.");
    }

    public AuthResponse verifyOtp(String email, String otp) {
        String normalizedEmail = normalizeEmail(email);
        OtpEntry entry = otpStore.get(normalizedEmail);

        if (entry == null || System.currentTimeMillis() > entry.expiresAt()) {
            otpStore.remove(normalizedEmail);
            throw new RuntimeException("OTP expired or not found. Please request a new OTP.");
        }

        if (!entry.otp().equals(otp.trim())) {
            throw new RuntimeException("Invalid OTP");
        }

        Patient patient = patientRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        otpStore.remove(normalizedEmail);
        String token = UUID.randomUUID().toString();
        AuthResponse response = new AuthResponse(token, "PATIENT", patient.getId(), null, patient.getFullName(),
                "Login successful");
        tokenStore.put(token, response);
        return response;
    }

    public AuthResponse staffLogin(String username, String password) {
        if (!staffUsername.equals(username) || !staffPassword.equals(password)) {
            throw new RuntimeException("Invalid staff credentials");
        }

        String token = UUID.randomUUID().toString();
        AuthResponse response = new AuthResponse(token, "STAFF", null, null, "Staff User", "Login successful");
        tokenStore.put(token, response);
        return response;
    }

    public AuthResponse doctorLogin(String username, String password) {
        if (!doctorUsername.equals(username) || !doctorPassword.equals(password)) {
            throw new RuntimeException("Invalid doctor credentials");
        }

        Doctor doctor = doctorRepository.findAll().stream()
                .findFirst()
                .orElseGet(this::ensurePrimaryDoctor);

        String token = UUID.randomUUID().toString();
        AuthResponse response = new AuthResponse(token, "DOCTOR", null, doctor.getId(), doctor.getFullName(),
                "Login successful");
        tokenStore.put(token, response);
        return response;
    }

    public AuthResponse validateToken(String token) {
        if (token == null || token.isBlank()) {
            throw new RuntimeException("Authentication required");
        }
        AuthResponse session = tokenStore.get(token);
        if (session == null) {
            throw new RuntimeException("Invalid or expired session");
        }
        return session;
    }

    private Doctor ensurePrimaryDoctor() {
        log.warn("No doctor record found in database; provisioning default doctor profile for login");
        Doctor doctor = new Doctor();
        doctor.setDoctorCode("DOC001");
        doctor.setFullName("Clinic Doctor");
        doctor.setSpecialization("General Medicine");
        return doctorRepository.save(doctor);
    }

    private String generateOtp() {
        return String.format("%06d", secureRandom.nextInt(1_000_000));
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email address is required");
        }
        return email.trim().toLowerCase();
    }

    private record OtpEntry(String otp, long expiresAt) {
    }
}
