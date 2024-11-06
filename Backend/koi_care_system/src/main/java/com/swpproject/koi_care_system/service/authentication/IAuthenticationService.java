package com.swpproject.koi_care_system.service.authentication;

import com.swpproject.koi_care_system.payload.request.AuthenticationRequest;
import com.swpproject.koi_care_system.payload.response.LoginResponse;

public interface IAuthenticationService {
    LoginResponse authenticate(AuthenticationRequest request);

    boolean forgotPassword(String email);

    boolean verifyUserOtp(String email, String otp);

    boolean resetPassword(String email, String password, String otp);
}