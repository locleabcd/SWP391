package com.swpproject.koi_care_system.controllers;

import com.nimbusds.jose.JOSEException;
import com.swpproject.koi_care_system.payload.request.AuthenticationRequest;
import com.swpproject.koi_care_system.payload.request.ResetPasswordRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.authentication.IAuthenticationService;
import com.swpproject.koi_care_system.service.user.IUserService;
import com.swpproject.koi_care_system.utils.JwtUtils;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    IAuthenticationService authService;
    IUserService userService;
    JwtUtils jwtUtils;

    @PostMapping("/loginKoiCare")
    ResponseEntity<ApiResponse> authenticate(@RequestBody @Valid AuthenticationRequest request) {
        var result = authService.authenticate(request);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Login successful")
                .data(result)
                .build());
    }

    @GetMapping("/verifyEmail")
    public ResponseEntity<Void> verifyUserEmail(
            @RequestParam String email,
            @RequestParam String token,
            @RequestParam String redirect) throws ParseException, JOSEException {

        boolean isVerified = jwtUtils.verificationToken(token);
        String redirectUrl = redirect + "?status=" + (isVerified ? "success" : "failed");

        if (isVerified) {
            userService.verifyUser(email, token);
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirectUrl)).build();
        } else {
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(redirectUrl)).build();
        }
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