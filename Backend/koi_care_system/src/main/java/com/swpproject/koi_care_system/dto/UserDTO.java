package com.swpproject.koi_care_system.dto;

import com.swpproject.koi_care_system.enums.Role;
import jakarta.validation.constraints.Email;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UserDTO {
    Long id;
    String username;
    @Email
    String email;
    Role role;
    boolean status;
}