package com.clinic.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import com.clinic.exception.EmailDeliveryException;

import jakarta.annotation.PostConstruct;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final String BREVO_SEND_EMAIL_URI = "/smtp/email";
    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy", Locale.ENGLISH);

    private final RestClient brevoClient;

    @Value("${app.brevo.api-key:}")
    private String brevoApiKey;

    @Value("${app.mail.from:}")
    private String fromEmail;

    @Value("${app.mail.from-name}")
    private String fromName;

    @Value("${app.otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    public EmailService() {
        this.brevoClient = RestClient.builder()
                .baseUrl("https://api.brevo.com/v3")
                .build();
    }

    @PostConstruct
    public void logMailConfiguration() {
        log.info(
                "Email configuration loaded: provider=Brevo, apiKeyConfigured={}, from={} <{}>",
                !brevoApiKey.isBlank(),
                fromName,
                fromEmail.isBlank() ? "(not set)" : fromEmail);

        if (brevoApiKey.isBlank()) {
            log.warn(
                    "BREVO_API_KEY is missing. Set BREVO_API_KEY before starting the backend. "
                            + "OTP and notification emails will fail until configured.");
        }

        if (fromEmail.isBlank()) {
            log.warn(
                    "MAIL_FROM is missing. Set MAIL_FROM to a verified Brevo sender address.");
        }
    }

    public void sendOtpEmail(String toEmail, String otp, String patientName) {
        log.info("sendOtpEmail called: patient={} to={}", patientName, toEmail);
        String subject = "Your KurePulse Clinic Login OTP";
        String body = String.format(
                "Dear %s,%n%n"
                        + "Your one-time password (OTP) for patient portal login is: %s%n%n"
                        + "This OTP is valid for %d minutes. Do not share it with anyone.%n%n"
                        + "If you did not request this code, please ignore this email.%n%n"
                        + "KurePulse Clinic",
                patientName,
                otp,
                otpExpiryMinutes);
        try {
            sendEmail(toEmail, subject, body, "OTP");
            log.info("sendOtpEmail completed successfully for to={}", toEmail);
        } catch (Exception ex) {
            log.error(
                    "sendOtpEmail failed for to={}: {} ({})",
                    toEmail,
                    ex.getMessage(),
                    ex.getClass().getName(),
                    ex);
            throw ex;
        }
    }

    public void sendAppointmentApprovedEmail(
            String toEmail,
            String patientName,
            LocalDate appointmentDate,
            String timeSlot,
            String doctorName) {
        log.info("sendAppointmentApprovedEmail called: patient={} to={}", patientName, toEmail);
        String subject = "Appointment Confirmed - KurePulse Clinic";
        String body = String.format(
                "Dear %s,%n%n"
                        + "Your appointment request has been approved.%n%n"
                        + "Appointment Details:%n"
                        + "- Patient Name: %s%n"
                        + "- Doctor: %s%n"
                        + "- Date: %s%n"
                        + "- Time Slot: %s%n%n"
                        + "Please arrive 10 minutes before your scheduled time.%n%n"
                        + "KurePulse Clinic",
                patientName,
                patientName,
                doctorName,
                formatDate(appointmentDate),
                formatTimeSlot(timeSlot));
        try {
            sendEmail(toEmail, subject, body, "APPOINTMENT_APPROVED");
            log.info("sendAppointmentApprovedEmail completed successfully for to={}", toEmail);
        } catch (Exception ex) {
            log.error(
                    "sendAppointmentApprovedEmail failed for to={}: {} ({})",
                    toEmail,
                    ex.getMessage(),
                    ex.getClass().getName(),
                    ex);
            throw ex;
        }
    }

    public void sendAppointmentRejectedEmail(
            String toEmail,
            String patientName,
            LocalDate appointmentDate,
            String timeSlot,
            String doctorName) {
        log.info("sendAppointmentRejectedEmail called: patient={} to={}", patientName, toEmail);
        String subject = "Appointment Request Update - KurePulse Clinic";
        String body = String.format(
                "Dear %s,%n%n"
                        + "We regret to inform you that your appointment request could not be accommodated at this time.%n%n"
                        + "Requested Details:%n"
                        + "- Patient Name: %s%n"
                        + "- Doctor: %s%n"
                        + "- Date: %s%n"
                        + "- Time Slot: %s%n%n"
                        + "Please contact the clinic or submit a new request with an alternative date.%n%n"
                        + "KurePulse Clinic",
                patientName,
                patientName,
                doctorName,
                formatDate(appointmentDate),
                formatTimeSlot(timeSlot));
        try {
            sendEmail(toEmail, subject, body, "APPOINTMENT_REJECTED");
            log.info("sendAppointmentRejectedEmail completed successfully for to={}", toEmail);
        } catch (Exception ex) {
            log.error(
                    "sendAppointmentRejectedEmail failed for to={}: {} ({})",
                    toEmail,
                    ex.getMessage(),
                    ex.getClass().getName(),
                    ex);
            throw ex;
        }
    }

    private void sendEmail(String toEmail, String subject, String body, String emailType) {
        log.info(
                "Sending {} email via Brevo from={} <{}> to={}",
                emailType,
                fromName,
                fromEmail,
                toEmail);

        if (brevoApiKey.isBlank() || fromEmail.isBlank()) {
            log.error(
                    "Email send aborted for {} email to {}: BREVO_API_KEY or MAIL_FROM is not configured",
                    emailType,
                    toEmail);
            throw new EmailDeliveryException(
                    "Email service is not configured. Set BREVO_API_KEY and MAIL_FROM environment variables.");
        }

        Map<String, Object> payload = buildPayload(toEmail, subject, body);

        try {
            brevoClient.post()
                    .uri(BREVO_SEND_EMAIL_URI)
                    .header("api-key", brevoApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();
            log.info("{} email sent successfully to {}", emailType, toEmail);
        } catch (RestClientResponseException ex) {
            logMailFailure(emailType, toEmail, ex);
            throw new EmailDeliveryException(
                    "Unable to send email at this time. Please try again later.",
                    ex);
        } catch (Exception ex) {
            logMailFailure(emailType, toEmail, ex);
            throw new EmailDeliveryException(
                    "Unable to send email at this time. Please try again later.",
                    ex);
        }
    }

    private Map<String, Object> buildPayload(String toEmail, String subject, String body) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sender", Map.of("name", fromName, "email", fromEmail));
        payload.put("to", List.of(Map.of("email", toEmail)));
        payload.put("subject", subject);
        payload.put("textContent", body);
        return payload;
    }

    private void logMailFailure(String emailType, String toEmail, Exception ex) {
        if (ex instanceof RestClientResponseException responseException) {
            log.error(
                    "Failed to send {} email to {} via Brevo: HTTP {} {}",
                    emailType,
                    toEmail,
                    responseException.getStatusCode().value(),
                    responseException.getStatusText());
            return;
        }

        log.error(
                "Failed to send {} email to {} via Brevo: {} ({})",
                emailType,
                toEmail,
                ex.getMessage(),
                ex.getClass().getSimpleName(),
                ex);
    }

    private String formatDate(LocalDate date) {
        if (date == null) {
            return "To be confirmed";
        }
        return date.format(DATE_FORMAT);
    }

    private String formatTimeSlot(String timeSlot) {
        if (timeSlot == null || timeSlot.isBlank()) {
            return "To be confirmed";
        }
        return timeSlot;
    }
}
