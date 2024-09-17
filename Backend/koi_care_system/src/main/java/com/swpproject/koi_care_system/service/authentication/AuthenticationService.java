package com.swpproject.koi_care_system.service.authentication;


import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.swpproject.koi_care_system.dto.UserDTO;
import com.swpproject.koi_care_system.enums.ErrorCode;
import com.swpproject.koi_care_system.exceptions.AppException;
import com.swpproject.koi_care_system.mapper.UserMapper;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.payload.request.AuthenticationRequest;
import com.swpproject.koi_care_system.payload.response.AuthenticationResponse;
import com.swpproject.koi_care_system.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    UserMapper userMapper;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        UserDTO userDTO = userMapper.maptoUserDTO(user);

        if (userDTO.getRoles().equals("GUEST")) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .id(userDTO.getId())
                .username(userDTO.getUsername())
                .roles(userDTO.getRoles())
                .token(token)
                .isAuthenticated(true)
                .build();
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
                        Instant.now().plus(30, ChronoUnit.MINUTES).toEpochMilli()
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
        //check if the token is unexpired
        boolean unexpired = expirationTime.after(new Date());

        if (verified && unexpired) {
            return true;
        }
        if (!verified) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
        if (!unexpired) {
            throw new AppException(ErrorCode.TOKEN_EXPIRED);
        }
        return false;//check if the token is valid and not unexpired
    }

    private String buildScope(User user) {
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            throw new AppException(ErrorCode.NO_ROLES);
        }
        return user.getRoles().stream().findFirst().orElseThrow(() -> new AppException(ErrorCode.NO_ROLES));
    }
}


