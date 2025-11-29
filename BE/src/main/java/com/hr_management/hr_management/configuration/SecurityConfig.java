package com.hr_management.hr_management.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private final String[] PUBLIC_ENDPOINTS = {
            "/users/save", "/auth/log-in", "/auth/log-out","/auth/introspect", "/auth/refresh-token", "/auth/refresh","/user/*",
            "/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**", "/api/v1/admin/**",
    };
    private CustomJwtDecoder customJwtDecoder;


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Tắt CSRF
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(customJwtDecoder)
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                        .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
                )
                .cors(Customizer.withDefaults());

        return http.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("http://localhost:5173");
        //        corsConfiguration.addAllowedOrigin("*"); // cho phép tất cả các domain
        corsConfiguration.addAllowedMethod("*"); // cho phép tất cả các method (GET, POST, PUT, DELETE, ...)
        corsConfiguration.addAllowedHeader("*"); // cho phép tất cả các header
        corsConfiguration.setAllowCredentials(true); // cho phép gửi cookie

        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource =
                new UrlBasedCorsConfigurationSource(); // ánh xạ cấu hình CORS cho các endpoint
        urlBasedCorsConfigurationSource.registerCorsConfiguration(
                "/**", corsConfiguration); // áp dụng cấu hình CORS cho tất cả các endpoint

        return new CorsFilter(urlBasedCorsConfigurationSource);
    }
}