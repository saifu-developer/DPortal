package com.clinic.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DoctorLoginRequest {

    private String username;
    private String password;
}
