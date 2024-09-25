package com.swpproject.koi_care_system.service.authentication;

import com.nimbusds.jose.JOSEException;
import com.swpproject.koi_care_system.dto.UserDTO;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.payload.request.AuthenticationRequest;

import java.text.ParseException;

public interface IAuthenticationService {
    UserDTO authenticate(AuthenticationRequest request);

    String generateToken(User user);

    boolean verificationToken(String token) throws JOSEException, ParseException;

    boolean forgotPassword(String email);

    boolean verifyUserOtp(String email, String otp);

    boolean resetPassword(String email, String password, String otp);
}
