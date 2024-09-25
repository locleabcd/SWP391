package com.swpproject.koi_care_system.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(
                        name = "Koi Care System",
                        email = "phuocstore@gmail.com"
                ),
                description = "Koi Care documentation for API",
                title = "Koi Care System API",
                version = "1.0.0",
                license = @License(
                        name = "Koi License",
                        url = "https://www.koi.com/license"
                ),
                termsOfService = "https://www.koi.com/terms"
        ),
        servers = {
                @Server(
                        description = "Local Server",
                        url = "http://localhost:8080/api"
                ),
                @Server(
                        description = "Deloy Server",
                        url = "https://koi-care-system.azurewebsites.net/api"
                )
        }
)
@SecurityScheme(
        name = "bearerAuth",
        description = "JWT Token",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}