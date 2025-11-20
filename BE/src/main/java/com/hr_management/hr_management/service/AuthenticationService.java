package com.hr_management.hr_management.service;

import com.devteria.identity_service.dto.request.AuthenticateRequest;
import com.devteria.identity_service.dto.request.IntrospectRequest;
import com.devteria.identity_service.dto.request.LogoutRequest;
import com.devteria.identity_service.dto.request.RefreshToken;
import com.devteria.identity_service.dto.response.AuthenticationResponse;
import com.devteria.identity_service.dto.response.IntrospectResponse;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticateRequest authenticateRequest);
    IntrospectResponse introspect(IntrospectRequest introspectRequest);
    SignedJWT verifyToken(String token,boolean isRefresh) throws JOSEException, ParseException;
    void logout(LogoutRequest request) throws ParseException, JOSEException;
    AuthenticationResponse refreshToken(RefreshToken refresgToken) throws ParseException, JOSEException;
}
