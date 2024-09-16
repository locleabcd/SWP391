package com.swpproject.koi_care_system.controllers;

import com.nimbusds.jose.JOSEException;
import com.swpproject.koi_care_system.payload.request.AuthenticationRequest;
import com.swpproject.koi_care_system.payload.request.IntrospectRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.authentication.IAuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    IAuthenticationService authService;

    @PostMapping("/login")
    ApiResponse authenticate(@RequestBody AuthenticationRequest request){
        var result = authService.authenticate(request);
        return ApiResponse.builder()
                .data(result)
                .build();
    }

    @PostMapping("/introspect")
    ApiResponse authenticate(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authService.introspect(request);
        return ApiResponse.builder()
                .data(result)
                .build();
    }
}
