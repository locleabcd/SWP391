package com.swpproject.koi_care_system.service.authentication;


import com.swpproject.koi_care_system.enums.ErrorCode;
import com.swpproject.koi_care_system.enums.Role;
import com.swpproject.koi_care_system.exceptions.AppException;
import com.swpproject.koi_care_system.mapper.UserMapper;
import com.swpproject.koi_care_system.payload.request.AuthenticationRequest;
import com.swpproject.koi_care_system.payload.response.LoginResponse;
import com.swpproject.koi_care_system.repository.UserRepository;
import com.swpproject.koi_care_system.service.email.IEmailService;
import com.swpproject.koi_care_system.service.otp.IOtpService;
import com.swpproject.koi_care_system.utils.JwtUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService implements IAuthenticationService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    IEmailService emailService;
    IOtpService otpService;
    UserMapper userMapper;
    JwtUtils jwtUtils;

    //Authenticate user
    @Override
    public LoginResponse authenticate(AuthenticationRequest request) {
        var user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }
        var token = jwtUtils.generateToken(user);
        if (!user.isStatus()) {
            if (user.getRole().equals(Role.GUEST)) {
                emailService.send(user.getUsername(), user.getEmail(), "Resend Verify Email", token);
            }
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return userMapper.maptoLoginResponse(user, token);
    }

    //Enter email to get OTP
    @Override
    public boolean forgotPassword(String email) {
        var user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        if (user != null) {
            String otp = generateOtp();
            otpService.saveOtp(email, otp);
            emailService.sendOtp(user.getUsername(), user.getEmail(), "Forgot Password", otp);

            return true;
        }
        return false;
    }

    @Override
    public boolean verifyUserOtp(String email, String otp) {
        return otpService.verifyOtp(email, otp);
    }

    @Override
    public boolean resetPassword(String email, String password, String otp) {
        if (otpService.verifyOtp(email, otp)) {
            var user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
            otpService.deleteOtp(email);
            return true;
        }
        return false;
    }

    private @NotNull String generateOtp() {
        SecureRandom secureRandom = new SecureRandom();
        int otp = secureRandom.nextInt(900000) + 100000; // Generates a number between 100000 and 999999
        return String.valueOf(otp);
    }
}

