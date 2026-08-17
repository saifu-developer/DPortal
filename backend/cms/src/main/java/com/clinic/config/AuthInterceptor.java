package com.clinic.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.clinic.dto.AuthResponse;
import com.clinic.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Autowired
    private AuthService authService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String path = request.getRequestURI();
        String method = request.getMethod();

        if (isPublicPath(path, method)) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        AuthResponse session;
        try {
            session = authService.validateToken(token);
        } catch (RuntimeException ex) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(ex.getMessage());
            return false;
        }

        request.setAttribute("authSession", session);

        if ("STAFF".equals(session.getRole()) && isWriteMethod(method)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Staff has read-only access");
            return false;
        }

        if ("PATIENT".equals(session.getRole()) && !isPatientAllowed(path, method, session)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Access denied");
            return false;
        }

        if (path.contains("/appointment-requests") && isWriteMethod(method)
                && !"DOCTOR".equals(session.getRole())) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Only doctors can manage appointment requests");
            return false;
        }

        return true;
    }

    private boolean isPublicPath(String path, String method) {
        if (path.startsWith("/api/auth/")) {
            return true;
        }
        if ("POST".equalsIgnoreCase(method) && path.equals("/api/public/appointment-requests")) {
            return true;
        }
        if ("GET".equalsIgnoreCase(method) && path.equals("/api/public/appointment-requests/availability")) {
            return true;
        }
        return false;
    }

    private boolean isWriteMethod(String method) {
        return "POST".equalsIgnoreCase(method)
                || "PUT".equalsIgnoreCase(method)
                || "PATCH".equalsIgnoreCase(method)
                || "DELETE".equalsIgnoreCase(method);
    }

    private boolean isPatientAllowed(String path, String method, AuthResponse session) {
        Long patientId = session.getPatientId();
        if (patientId == null) {
            return false;
        }

        if ("GET".equalsIgnoreCase(method)) {
            return path.matches("/api/appointments/patient/" + patientId)
                    || path.matches("/api/prescriptions/patient/" + patientId)
                    || path.matches("/api/reports/patient/" + patientId)
                    || path.equals("/api/patients/" + patientId)
                    || path.equals("/api/patients/" + patientId + "/profile")
                    || path.matches("/api/prescriptions/\\d+")
                    || path.matches("/api/prescriptions/\\d+/pdf")
                    || path.matches("/api/reports/\\d+")
                    || path.matches("/api/reports/\\d+/download");
        }

        if ("PUT".equalsIgnoreCase(method) && path.equals("/api/patients/" + patientId)) {
            return true;
        }

        if ("POST".equalsIgnoreCase(method) && path.equals("/api/reports")) {
            return true;
        }

        return false;
    }
}
