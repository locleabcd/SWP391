package com.swpproject.koi_care_system.payload.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class AuthenticationResponse {
    Long id;
    String username;
    String role;
    String token;
    boolean authenticated;
}