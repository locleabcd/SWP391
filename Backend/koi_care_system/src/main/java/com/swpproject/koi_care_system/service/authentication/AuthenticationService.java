package com.swpproject.koi_care_system.service.authentication;


import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.swpproject.koi_care_system.enums.ErrorCode;
import com.swpproject.koi_care_system.enums.Role;
import com.swpproject.koi_care_system.exceptions.AppException;
import com.swpproject.koi_care_system.mapper.UserMapper;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.payload.request.AuthenticationRequest;
import com.swpproject.koi_care_system.payload.response.LoginResponse;
import com.swpproject.koi_care_system.repository.UserRepository;
import com.swpproject.koi_care_system.service.email.IEmailService;
import com.swpproject.koi_care_system.service.otp.IOtpService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;


@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService implements IAuthenticationService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    IEmailService emailService;
    IOtpService otpService;
    UserMapper userMapper;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    //Authenticate user
    @Override
    public LoginResponse authenticate(AuthenticationRequest request) {
        var user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }
        var token = generateToken(user);
        if (user.getRole().equals(Role.GUEST) && !user.isStatus()) {
            emailService.send(user.getUsername(), user.getEmail(), "Resend Verify Email", token);
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return userMapper.maptoLoginResponse(user, token);
    }

    public String generateToken(User user) {
        // Create HMAC signer
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        // Create JWT claims set
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("phuoc.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.DAYS).toEpochMilli()
                ))
                .claim("scope", buildScope(user))
                .build();

        // Create the payload
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        // Create the JWS object and sign it
        //JWT  three parts: header, payload, signature
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Error generate Token", e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean verificationToken(String token) throws JOSEException, ParseException {

        // Create HMAC verifier with Signer Key
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        // Verify the token with signer key
        boolean verified = signedJWT.verify(verifier);
        //check if the token is expired
        boolean expired = expirationTime.before(new Date());//true if expired

        if (verified && !expired) {
            return true;
        }
        if (!verified) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }

        return false;//check if the token is valid and not unexpired
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

    private Role buildScope(User user) {
        if (user.getRole() == null) {
            throw new AppException(ErrorCode.NO_ROLES);
        }
        return user.getRole();
    }

    private @NotNull String generateOtp() {
        SecureRandom secureRandom = new SecureRandom();
        int otp = secureRandom.nextInt(900000) + 100000; // Generates a number between 100000 and 999999
        return String.valueOf(otp);
    }
}

