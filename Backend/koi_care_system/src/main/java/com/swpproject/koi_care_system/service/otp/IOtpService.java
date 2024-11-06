package com.swpproject.koi_care_system.service.otp;

public interface IOtpService {
    void saveOtp(String email, String token);

    boolean verifyOtp(String email, String otp);

    void deleteOtp(String email);
}