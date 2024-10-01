package com.swpproject.koi_care_system.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ResetPasswordRequest {
    @Email(message = "Invalid email address")
    @NotBlank(message = "Email is required")
    String email;
    @NotBlank(message = "OTP is required")
    String otp;
    @Size(min = 8, message = "USER_NEW_PASSWORD")
    String newPassword;

}