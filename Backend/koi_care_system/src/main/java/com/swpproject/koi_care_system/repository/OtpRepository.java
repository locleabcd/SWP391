package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findByEmail(String email);

    Optional<Otp> findByEmailAndOtp(String email, String otp);
}