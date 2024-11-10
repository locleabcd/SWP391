package com.swpproject.koi_care_system.service.email;

import com.swpproject.koi_care_system.models.Reminder;

public interface IEmailService {
    void send(String name, String to, String subject, String token);

    void sendOtp(String name, String to, String subject, String otp);

    void sendReminder(String name, String to, String subject, Reminder reminderDetail);

}