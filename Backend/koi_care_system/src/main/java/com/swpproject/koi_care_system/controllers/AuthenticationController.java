package com.swpproject.koi_care_system.controllers;

import com.nimbusds.jose.JOSEException;
import com.swpproject.koi_care_system.payload.request.AuthenticationRequest;
import com.swpproject.koi_care_system.payload.request.ResetPasswordRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.authentication.IAuthenticationService;
import com.swpproject.koi_care_system.service.user.IUserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    IAuthenticationService authService;
    IUserService userService;

    @PostMapping("/loginKoiCare")
    ResponseEntity<ApiResponse> authenticate(@RequestBody @Valid AuthenticationRequest request) {
        var result = authService.authenticate(request);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Login successful")
                .data(result)
                .build());
    }

    @GetMapping("/verifyEmail")
    ResponseEntity<ApiResponse> verifyUserEmail(@RequestParam String email, @RequestParam String token) throws ParseException, JOSEException {
        var result = authService.verificationToken(token);
        if (result) {
            userService.verifyUser(email, token);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.builder()
                    .message("Invalid or expired token")
                    .data(false)
                    .build());
        }
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Verify token")
                .data(true)
                .build());
    }

    @PostMapping("/forgotPassword/{email}")
    ResponseEntity<ApiResponse> forgotPassword(@PathVariable String email) {
        var result = authService.forgotPassword(email);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Forgot password")
                .data(result)
                .build());
    }

    @PostMapping("/verifyOtp/{email}/{otp}")
    ResponseEntity<ApiResponse> verifyOtp(@PathVariable String email, @PathVariable String otp) {
        var result = authService.verifyUserOtp(email, otp);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Verify otp")
                .data(result)
                .build());
    }

    @PostMapping("/resetPassword")
    ResponseEntity<ApiResponse> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        var result = authService.resetPassword(request.getEmail(), request.getNewPassword(), request.getOtp());
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Reset password successful")
                .data(result)
                .build());
    }

}