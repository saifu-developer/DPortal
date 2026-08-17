package com.clinic.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SlotAvailabilityResponse {

    private LocalDate date;
    private List<String> bookedSlots;
    private List<String> availableSlots;
}
