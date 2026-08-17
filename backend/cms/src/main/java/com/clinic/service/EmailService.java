package com.clinic.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy", Locale.ENGLISH);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.host}")
    private String mailHost;

    @Value("${spring.mail.port}")
    private int mailPort;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.from-name}")
    private String fromName;

    @Value("${app.otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    @PostConstruct
    public void logMailConfiguration() {
        boolean credentialsConfigured = !mailUsername.isBlank() && !mailPassword.isBlank();
        log.info(
                "Mail configuration loaded: host={}, port={}, username={}, passwordConfigured={}, from={} <{}>",
                mailHost,
                mailPort,
                mailUsername.isBlank() ? "(not set)" : mailUsername,
                credentialsConfigured,
                fromName,
                fromEmail);

        if (!credentialsConfigured) {
            log.warn(
                    "SMTP credentials are missing. Set MAIL_USERNAME and MAIL_PASSWORD environment variables "
                            + "before starting the backend. OTP and notification emails will fail until configured.");
        }

        if (!mailUsername.isBlank() && !fromEmail.equalsIgnoreCase(mailUsername)) {
            log.warn(
                    "MAIL_FROM ({}) does not match MAIL_USERNAME ({}). Gmail requires the sender address "
                            + "to match the authenticated account.",
                    fromEmail,
                    mailUsername);
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
                "Sending {} email via SMTP host={} port={} from={} <{}> to={}",
                emailType,
                mailHost,
                mailPort,
                fromName,
                fromEmail,
                toEmail);

        if (mailUsername.isBlank() || mailPassword.isBlank()) {
            log.error(
                    "SMTP send aborted for {} email to {}: MAIL_USERNAME or MAIL_PASSWORD is not configured",
                    emailType,
                    toEmail);
            throw new MailAuthenticationException(
                    "SMTP credentials are not configured. Set MAIL_USERNAME and MAIL_PASSWORD environment variables.");
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);
            log.info("{} email sent successfully to {}", emailType, toEmail);
        } catch (MailAuthenticationException ex) {
            logMailFailure(emailType, toEmail, ex);
            throw new MailAuthenticationException(
                    resolveMailAuthMessage(ex),
                    ex);
        } catch (MailException ex) {
            logMailFailure(emailType, toEmail, ex);
            throw ex;
        }
    }

    private String resolveMailAuthMessage(MailAuthenticationException ex) {
        String rootCause = getRootCauseMessage(ex);
        if (mailUsername.isBlank() || mailPassword.isBlank()) {
            return "SMTP credentials are not configured. Set MAIL_USERNAME and MAIL_PASSWORD environment variables.";
        }
        if (rootCause != null && rootCause.contains("no password specified")) {
            return "SMTP password is missing. Set the MAIL_PASSWORD environment variable to your Gmail App Password.";
        }
        return "SMTP authentication failed. Verify MAIL_USERNAME and MAIL_PASSWORD (use a Gmail App Password, not your regular password). Root cause: "
                + rootCause;
    }

    private String getRootCauseMessage(Throwable ex) {
        Throwable root = ex;
        while (root.getCause() != null) {
            root = root.getCause();
        }
        return root.getMessage();
    }

    private void logMailFailure(String emailType, String toEmail, Exception ex) {
        log.error(
                "Failed to send {} email to {} via host={} port={} username={}: {} ({})",
                emailType,
                toEmail,
                mailHost,
                mailPort,
                mailUsername.isBlank() ? "(not set)" : mailUsername,
                ex.getMessage(),
                ex.getClass().getSimpleName(),
                ex);

        Throwable cause = ex.getCause();
        while (cause != null) {
            log.error(
                    "Caused by: {} - {}",
                    cause.getClass().getName(),
                    cause.getMessage());
            cause = cause.getCause();
        }
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
