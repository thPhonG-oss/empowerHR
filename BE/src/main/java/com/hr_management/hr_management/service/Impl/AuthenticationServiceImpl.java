package com.hr_management.hr_management.service.Impl;


import com.hr_management.hr_management.dto.request.AuthenticateRequest;
import com.hr_management.hr_management.dto.request.IntrospectRequest;
import com.hr_management.hr_management.dto.request.LogoutRequest;
import com.hr_management.hr_management.dto.request.RefreshToken;
import com.hr_management.hr_management.dto.response.AuthenticationResponse;
import com.hr_management.hr_management.dto.response.IntrospectResponse;
import com.hr_management.hr_management.entity.Account;
import com.hr_management.hr_management.entity.InvalidatedToken;
import com.hr_management.hr_management.exception.AppException;
import com.hr_management.hr_management.exception.ErrorCode;
import com.hr_management.hr_management.repository.AccountRepository;
import com.hr_management.hr_management.repository.InvalidatedTokenRepository;
import com.hr_management.hr_management.service.AuthenticationService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements AuthenticationService {
    private static final Logger log = LoggerFactory.getLogger(AuthenticationServiceImpl.class);
    AccountRepository accountRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;
    @NonFinal
    @Value("${jwt.secret}")
    protected String key;
    @NonFinal
    @Value("${jwt.access-token-validity-seconds}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refresh-token-validity-seconds}")
    protected long REFRESHABLE_DURATION;

    @Override
    public AuthenticationResponse authenticate(AuthenticateRequest authenticateRequest,HttpServletResponse response) {
         Account account=accountRepository.findByUsername(authenticateRequest.getUserName())
                .orElseThrow(() ->new AppException(ErrorCode.ACCOUNT_NOT_EXITS));
        PasswordEncoder passwordEncoder= new BCryptPasswordEncoder(10);
        boolean authenticated=passwordEncoder.matches(authenticateRequest.getPassword(),account.getPassword());
        log.warn("Raw pw = " + authenticateRequest.getPassword());
        log.warn("Hash pw = " + account.getPassword());
        log.warn("Matched = " + authenticated);


        if(!authenticated)
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        String accessToken=generalToken(account);
        String refreshToken=generateRefreshToken(account);
        setRefreshCookie(response,refreshToken);
        return AuthenticationResponse.builder()
                .acessToken(accessToken)
                .build();
    }
    private void setRefreshCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge((int) REFRESHABLE_DURATION);
        response.addCookie(cookie);
    }

    private void clearRefreshCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("refresh_token", "");
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    private String extractRefreshToken(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if (cookie.getName().equals("refresh_token")) {
                return cookie.getValue();
            }
        }
        return null;
    }

    public String generalToken(Account account) {

        JWSHeader header= new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet=new JWTClaimsSet.Builder()
                .subject(account.getUsername())
                .issuer("cuong.com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope",buildScope(account))
                .build();
        Payload payload=new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject= new JWSObject(header,payload);
        try{
            jwsObject.sign(new MACSigner(key.getBytes()));
            return jwsObject.serialize();
        }catch (JOSEException e){
            throw new RuntimeException(e);
        }
    }
    public String generateRefreshToken(Account account) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(account.getUsername())
                .issuer("cuong.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("type", "refresh")
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(key.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    private String buildScope(Account account) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(account.getRoles())) {
            account.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions())) {
                    role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
                }
            });
        }
        System.out.println("Scope = " +account);
        return stringJoiner.toString();
    }
    @SneakyThrows
    @Override
    public IntrospectResponse introspect(IntrospectRequest introspectRequest) {
        String token=introspectRequest.getToken();
        boolean isValid=true;
        try{
            verifyToken(token,false);
        }catch(AppException e){
            isValid=false;
        }

        return IntrospectResponse.builder()
                .valid(isValid)
                .build();

    }

    @Override
    public SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier jwsVerifier=new MACVerifier(key.getBytes());

        SignedJWT signedJWT= SignedJWT.parse(token);
        if(isRefresh){
            String type = signedJWT.getJWTClaimsSet().getStringClaim("type");
            if (!"refresh".equals(type))
                throw new AppException(ErrorCode.UNAUTHENTICATED);

        }
        var verify=signedJWT.verify(jwsVerifier);

        Date expiryTime= signedJWT.getJWTClaimsSet().getExpirationTime();

        if (!(verify&&expiryTime.after(new Date())))
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }

    @Override
    public void logout(HttpServletRequest request,HttpServletResponse response) throws ParseException, JOSEException {
        try{
            String refreshToken=extractRefreshToken(request);
            SignedJWT signedJWT=verifyToken(refreshToken,true);
            String jit=signedJWT.getJWTClaimsSet().getJWTID();
            Date expiryTime=signedJWT.getJWTClaimsSet().getExpirationTime();
            InvalidatedToken invalidatedToken=InvalidatedToken.builder().id(jit).expireTime(expiryTime).build();
            invalidatedTokenRepository.save(invalidatedToken);
            clearRefreshCookie(response);
        }catch(AppException e){
            log.info("Token already expire");
        }
    }

    @Override
    public AuthenticationResponse refreshToken(HttpServletRequest request,HttpServletResponse response) throws ParseException, JOSEException {
        String refreshToken=extractRefreshToken(request);
        if (refreshToken == null)
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        SignedJWT signedJWT=verifyToken(refreshToken,true);

        String jit=signedJWT.getJWTClaimsSet().getJWTID().toString();
        Date expiryTime=signedJWT.getJWTClaimsSet().getExpirationTime();
        String nameUser=signedJWT.getJWTClaimsSet().getSubject();
        Account account=accountRepository.findByUsername(nameUser).orElseThrow(()->new AppException(ErrorCode.ACCOUNT_NOT_EXITS));
        InvalidatedToken invalidatedToken=InvalidatedToken.builder()
                .id(jit)
                .expireTime(expiryTime)
                .token(refreshToken)
                .account(account)
                .build();
        invalidatedTokenRepository.save(invalidatedToken);


        String newAccessToken=generalToken(account);
        String newRefreshToken=generateRefreshToken(account);
        setRefreshCookie(response,newRefreshToken);

        return AuthenticationResponse.builder()
                .acessToken(newAccessToken)
                .build();

    }
}
