package com.swpproject.koi_care_system.dto.request;

import lombok.Data;

import java.sql.Date;

@Data
public class CreateUserRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String status;
}
