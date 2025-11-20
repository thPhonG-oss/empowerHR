package com.hr_management.hr_management.configuration;

import com.devteria.identity_service.dto.request.IntrospectRequest;
import com.devteria.identity_service.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;

@Component
public class CustomJwtDecoder implements JwtDecoder {
    @Value("${jwt.signerKey}")
    private String signerKey;
    @Autowired
    private AuthenticationService authenticationService;
    private  NimbusJwtDecoder nimbusJwtDecoder;

    @Override
    public Jwt decode(String token) throws JwtException {
        var response=authenticationService.introspect(IntrospectRequest.builder().token(token).build());
        if (!response.isValid())
            throw new JwtException("Token invalid");
        SecretKeySpec secretKeySpec=new SecretKeySpec(signerKey.getBytes(),"HmacSHA512");
        nimbusJwtDecoder=NimbusJwtDecoder.withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
        return nimbusJwtDecoder.decode(token);
    }
}
