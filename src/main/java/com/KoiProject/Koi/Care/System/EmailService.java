package com.KoiProject.Koi.Care.System;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    private static final String FROM_EMAIL = "storephuoc@gmail.com";
    public void send(String to, String subject, String htmlContent) throws MessagingException {
        // Create a MIME message
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        // Use MimeMessageHelper to handle multipart and encoding
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");
        helper.setFrom(FROM_EMAIL); // From email
        helper.setTo(to);           // Recipient
        helper.setSubject(subject); // Email subject
        helper.setText(htmlContent, true); // HTML content

        // Send the email
        mailSender.send(mimeMessage);

        System.out.println("Email sent successfully.");
    }
}
