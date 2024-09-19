package com.swpproject.koi_care_system.controllers;

import com.nimbusds.jose.JOSEException;
import com.swpproject.koi_care_system.payload.request.AuthenticationRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.authentication.IAuthenticationService;
import com.swpproject.koi_care_system.service.user.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    IAuthenticationService authService;
    UserService userService;

    @PostMapping("/login")
    ApiResponse authenticate(@RequestBody @Valid AuthenticationRequest request) {
        var result = authService.authenticate(request);
        return ApiResponse.builder()
                .data(result)
                .build();
    }

    @GetMapping("/verify")
    ApiResponse verifyUserEmail(@RequestParam String email, @RequestParam String token) throws ParseException, JOSEException {
        var result = authService.verificationToken(token);
        if (result) {
            userService.verifyUser(email, token);
        }
        return ApiResponse.builder()
                .message("Verify token")
                .data(result)
                .build();
    }
}
