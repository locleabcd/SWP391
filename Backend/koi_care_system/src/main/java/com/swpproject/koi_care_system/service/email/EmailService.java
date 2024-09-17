package com.swpproject.koi_care_system.service.email;

import com.swpproject.koi_care_system.enums.ErrorCode;
import com.swpproject.koi_care_system.exceptions.AppException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

import static com.swpproject.koi_care_system.ultis.EmailUtils.getVerificationUrl;

@Service
@RequiredArgsConstructor
public class EmailService implements IEmailService {

    public static final String EMAIL_TEMPLATE = "emailtemplate";
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String FROM_EMAIL;

    @Override
    @Async
    public void send(String name, String to, String subject, String token) {
        try {
            Context context = new Context();
            context.setVariables(Map.of("name", name, "url", getVerificationUrl(to, token)));
            String text = templateEngine.process(EMAIL_TEMPLATE, context);

            // Create a MIME message
            MimeMessage mimeMessage = mailSender.createMimeMessage();

            // Use MimeMessageHelper to handle multipart and encoding
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, "UTF-8");
            helper.setFrom(FROM_EMAIL); // From email
            helper.setTo(to);           // Recipient
            helper.setSubject(subject); // Email subject
            helper.setText(text, true); // HTML content

            // Send the email
            mailSender.send(mimeMessage);

            System.out.println("Email sent successfully.");
        } catch (MessagingException e) {
            e.printStackTrace();
            throw new AppException(ErrorCode.SENDMAIL_FAILED);
        }
    }
}