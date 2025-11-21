package com.hr_management.hr_management.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .description("JWT Bearer Token");

        SecurityRequirement securityRequirement = new SecurityRequirement().addList("Bearer Authentication");

        return new OpenAPI()
                .info(
                        new Info()
                                .title("Spring boot ecommerce APIs")
                                .version("1.0.0")
                                .description("This is a Spring Boot Ecommerce API")
                                .license(new License().name("Apache 2.0").url("http://springdoc.org"))
                                .contact(
                                        new Contact()
                                                .name("Nguyen Thanh Phong")
                                                .email("ngthanhphong0817@gmail.com")
                                                .url("https://github.com/thPhonG-oss")
                                )
                )
                .externalDocs(
                        new ExternalDocumentation()
                                .description("Project documentation")
                                .url("https://github.com/thPhonG-oss/ecommerce")
                )
                .components(
                        new Components()
                                .addSecuritySchemes("Bearer Authentication", securityScheme)
                )
                .addSecurityItem(securityRequirement);
    }
}
