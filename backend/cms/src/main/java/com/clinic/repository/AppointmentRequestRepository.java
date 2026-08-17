package com.clinic.repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.clinic.entity.AppointmentRequest;

public interface AppointmentRequestRepository extends JpaRepository<AppointmentRequest, Long> {

    List<AppointmentRequest> findAllByOrderByIdDesc();

    long countByStatus(String status);

    boolean existsByPreferredDateAndPreferredTimeSlotAndStatusIn(
            LocalDate preferredDate, String preferredTimeSlot, Collection<String> statuses);

    boolean existsByPreferredDateAndPreferredTimeSlotAndStatusInAndIdNot(
            LocalDate preferredDate, String preferredTimeSlot, Collection<String> statuses, Long id);

    List<AppointmentRequest> findByPreferredDateAndStatusIn(
            LocalDate preferredDate, Collection<String> statuses);
}
