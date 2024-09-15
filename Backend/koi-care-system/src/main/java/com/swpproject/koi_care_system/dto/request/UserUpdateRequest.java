package com.swpproject.koi_care_system.dto.request;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String address;
    private int gender;
    private String status;
}
