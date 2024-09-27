package com.swpproject.koi_care_system.payload.response;

import jakarta.validation.constraints.Email;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class UserBlog {
    Long id;
    String username;
    @Email
    String email;
    String role;
}
