package com.swpproject.koi_care_system.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String address;
    private String gender;
    private List<OrderDto> orders;
    private CartDto cart;
}
