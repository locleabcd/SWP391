package com.swpproject.koi_care_system.payload.request;

import com.swpproject.koi_care_system.enums.ProfileStatus;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProfileUpdateRequest {
    String phone;
    String address;
    String gender;
    MultipartFile file;
    String bio;
    LocalDate dateOfBirth;
}