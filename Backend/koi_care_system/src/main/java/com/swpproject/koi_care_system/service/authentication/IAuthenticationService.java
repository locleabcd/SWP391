package com.swpproject.koi_care_system.service.authentication;

import com.nimbusds.jose.JOSEException;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.payload.request.AuthenticationRequest;
import com.swpproject.koi_care_system.payload.response.LoginResponse;

import java.text.ParseException;

public interface IAuthenticationService {
    LoginResponse authenticate(AuthenticationRequest request);

    String generateToken(User user);

    boolean verificationToken(String token) throws JOSEException, ParseException;

    boolean forgotPassword(String email);

    boolean verifyUserOtp(String email, String otp);

    boolean resetPassword(String email, String password, String otp);
}