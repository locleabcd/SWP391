package com.swpproject.koi_care_system.service;

import com.nimbusds.jose.JOSEException;
import com.swpproject.koi_care_system.dto.request.AuthenticationRequest;
import com.swpproject.koi_care_system.dto.request.IntrospectRequest;
import com.swpproject.koi_care_system.dto.response.AuthenticationResponse;
import com.swpproject.koi_care_system.dto.response.IntrospectResponse;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticationRequest request);
    String generateToken(String username);
    IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;
}
