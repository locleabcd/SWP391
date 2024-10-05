package com.swpproject.koi_care_system.dto;

import com.swpproject.koi_care_system.enums.ProfileStatus;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfileDto {
    long id;
    String name;
    String email;
    String phone;
    String address;
    String gender;
    String avatar;
    String bio;
    LocalDate dateOfBirth;
    LocalDate createdDate;
    ProfileStatus status;
    String role;
}