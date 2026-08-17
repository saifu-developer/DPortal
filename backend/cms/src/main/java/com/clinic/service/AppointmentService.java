package com.clinic.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.clinic.entity.Appointment;
import com.clinic.repository.AppointmentRepository;
import com.clinic.repository.DoctorRepository;
import com.clinic.repository.PatientRepository;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public Appointment saveAppointment(Appointment appointment) {
        if (appointment.getStatus() != null) {
            appointment.setStatus(appointment.getStatus().trim().toUpperCase());
        } else {
            appointment.setStatus("SCHEDULED");
        }
        resolveRelationships(appointment);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id).orElse(null);
    }

    public Appointment updateAppointment(Long id, Appointment appointment) {

        Appointment existingAppointment =
                appointmentRepository.findById(id).orElse(null);

        existingAppointment.setPatientId(appointment.getPatientId());
        existingAppointment.setDoctorId(appointment.getDoctorId());
        resolveRelationships(existingAppointment);
        existingAppointment.setAppointmentDate(appointment.getAppointmentDate());
        existingAppointment.setAppointmentTime(appointment.getAppointmentTime());
        existingAppointment.setSymptoms(appointment.getSymptoms());
        if (appointment.getStatus() != null) {
            existingAppointment.setStatus(appointment.getStatus().trim().toUpperCase());
        }

        return appointmentRepository.save(existingAppointment);
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatient_IdOrderByAppointmentDateDesc(patientId);
    }

    private void resolveRelationships(Appointment appointment) {
        if (appointment.getPatientId() != null) {
            appointment.setPatient(
                    patientRepository.getReferenceById(appointment.getPatientId()));
        }
        if (appointment.getDoctorId() != null) {
            appointment.setDoctor(
                    doctorRepository.getReferenceById(appointment.getDoctorId()));
        }
    }
}
