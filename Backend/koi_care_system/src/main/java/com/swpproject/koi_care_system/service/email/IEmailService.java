package com.swpproject.koi_care_system.service.email;

public interface IEmailService {
    void send(String name, String to, String subject, String token);

    void sendOtp(String name, String to, String subject, String otp);
}