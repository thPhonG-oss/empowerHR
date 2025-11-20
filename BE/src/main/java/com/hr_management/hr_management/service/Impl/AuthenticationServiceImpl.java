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
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
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
    public AuthenticationResponse authenticate(AuthenticateRequest authenticateRequest) {
        Account account=accountRepository.findByUsername(authenticateRequest.getUserName())
                .orElseThrow(() ->new AppException(ErrorCode.NOT_ENOUGHT_CHARACTER_USERNAME));
        PasswordEncoder passwordEncoder= new BCryptPasswordEncoder(10);
        boolean authenticated=passwordEncoder.matches(authenticateRequest.getPassword(),account.getPassword());
        if(!authenticated)
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        String token=generalToken(account);
        return AuthenticationResponse.builder()
                .acessToken(token)
                .build();
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
    public SignedJWT verifyToken(String token,boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier jwsVerifier=new MACVerifier(key.getBytes());

        SignedJWT signedJWT= SignedJWT.parse(token);

        var verify=signedJWT.verify(jwsVerifier);

        Date expiryTime=(isRefresh)
                ?new Date(signedJWT
                .getJWTClaimsSet()
                .getIssueTime()
                .toInstant()
                .plus(REFRESHABLE_DURATION,ChronoUnit.SECONDS)
                .toEpochMilli())
                :signedJWT.getJWTClaimsSet().getExpirationTime();

        if (!(verify&&expiryTime.after(new Date())))
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        return signedJWT;
    }

    @Override
    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try{
            SignedJWT signedJWT=verifyToken(request.getToken(),true);
            String jit=signedJWT.getJWTClaimsSet().getJWTID();
            Date expiryTime=signedJWT.getJWTClaimsSet().getExpirationTime();
            InvalidatedToken invalidatedToken=InvalidatedToken.builder().id(jit).expireTime(expiryTime).build();
            invalidatedTokenRepository.save(invalidatedToken);
        }catch(AppException e){
            log.info("Token already expire");
        }
    }

    @Override
    public AuthenticationResponse refreshToken(RefreshToken refreshToken) throws ParseException, JOSEException {
        SignedJWT signedJWT=verifyToken(refreshToken.getToken(),true);

        String jit=signedJWT.getJWTClaimsSet().getJWTID().toString();
        Date expiryTime=signedJWT.getJWTClaimsSet().getExpirationTime();
        InvalidatedToken invalidatedToken=InvalidatedToken.builder().id(jit).expireTime(expiryTime).build();
        invalidatedTokenRepository.save(invalidatedToken);
        String nameUser=signedJWT.getJWTClaimsSet().getSubject();
        Account account=accountRepository.findByUsername(nameUser).orElseThrow(()->new AppException(ErrorCode.USER_EXISTED));
        String token=generalToken(account);

        return AuthenticationResponse.builder()
                .acessToken(token)
                .build();

    }
}