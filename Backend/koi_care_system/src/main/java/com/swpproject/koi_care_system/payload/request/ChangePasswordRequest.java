package com.swpproject.koi_care_system.payload.request;

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
public class ChangePasswordRequest {
    String currentPassword;
    @Size(min = 8, message = "USER_PASSWORD")
    String newPassword;
    @Size(min = 8, message = "USER_CONFIRM_PASSWORD")
    String confirmationPassword;
}
