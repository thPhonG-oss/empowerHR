package com.hr_management.hr_management.service;


import com.hr_management.hr_management.dto.request.AuthenticateRequest;
import com.hr_management.hr_management.dto.request.IntrospectRequest;
import com.hr_management.hr_management.dto.request.LogoutRequest;
import com.hr_management.hr_management.dto.request.RefreshToken;
import com.hr_management.hr_management.dto.response.AuthenticationResponse;
import com.hr_management.hr_management.dto.response.IntrospectResponse;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.SneakyThrows;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationResponse authenticate(AuthenticateRequest authenticateRequest, HttpServletResponse response);
    IntrospectResponse introspect(IntrospectRequest introspectRequest);
    SignedJWT verifyToken(String token,boolean isRefresh) throws JOSEException, ParseException;
    void logout(HttpServletRequest request,HttpServletResponse response) throws ParseException, JOSEException;
    AuthenticationResponse refreshToken(HttpServletRequest request, HttpServletResponse response) throws ParseException, JOSEException;
}

