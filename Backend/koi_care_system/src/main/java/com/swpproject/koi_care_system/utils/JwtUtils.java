package com.swpproject.koi_care_system.utils;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.swpproject.koi_care_system.enums.ErrorCode;
import com.swpproject.koi_care_system.enums.Role;
import com.swpproject.koi_care_system.exceptions.AppException;
import com.swpproject.koi_care_system.models.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Component
public class JwtUtils {


    @Value("${jwt.signerKey}")
    private String SIGNER_KEY;


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
            throw new RuntimeException(e);
        }
    }

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

        return false;
    }

    public String getUsernameFromToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet().getSubject();
        } catch (ParseException e) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
    }

    private Role buildScope(User user) {
        if (user.getRole() == null) {
            throw new AppException(ErrorCode.NO_ROLES);
        }
        return user.getRole();
    }

    public static String generateRandomPassword() {
        String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lower = upper.toLowerCase();
        String digits = "0123456789";
        String alphanum = upper + lower + digits;
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(8);
        for (int i = 0; i < 8; i++) {
            int index = random.nextInt(alphanum.length());
            sb.append(alphanum.charAt(index));
        }
        return sb.toString();
    }
}