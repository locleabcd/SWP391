package com.swpproject.koi_care_system.config;

import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import static com.swpproject.koi_care_system.enums.Role.ADMIN;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initRoles() {
        return args -> {
            if (!userRepository.existsByUsername("admin")) {
                User admin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .email("admin@gmail.com")
                        .status(true)
                        .role(ADMIN)
                        .provider("LOCAL")
                        .build();

                userRepository.save(admin);

            }
        };
    }
}