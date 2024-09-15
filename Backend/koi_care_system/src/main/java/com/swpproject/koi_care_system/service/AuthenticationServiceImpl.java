package com.swpproject.koi_care_system.service;

import com.nimbusds.jose.JOSEException;
import com.swpproject.koi_care_system.payload.request.AuthenticationRequest;
import com.swpproject.koi_care_system.payload.request.IntrospectRequest;
import com.swpproject.koi_care_system.payload.response.AuthenticationResponse;
import com.swpproject.koi_care_system.payload.response.IntrospectResponse;

import java.text.ParseException;

public interface AuthenticationServiceImpl {
    AuthenticationResponse authenticate(AuthenticationRequest request);
    String generateToken(String username);
    IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException;
}
