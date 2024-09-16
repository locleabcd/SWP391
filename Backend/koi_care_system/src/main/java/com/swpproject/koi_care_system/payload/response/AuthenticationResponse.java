package com.swpproject.koi_care_system.payload.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class AuthenticationResponse {
    Long id;
    String username;
    Set<String> roles;
    String token;
    boolean isAuthenticated;
}
