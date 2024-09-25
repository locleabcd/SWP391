package com.swpproject.koi_care_system.service.otp;

import com.swpproject.koi_care_system.enums.ErrorCode;
import com.swpproject.koi_care_system.exceptions.AppException;
import com.swpproject.koi_care_system.models.Otp;
import com.swpproject.koi_care_system.repository.OtpRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OtpService implements IOtpService {
    OtpRepository otpRepository;

    @Override
    public void saveOtp(String email, String token) {
        //Check if otp existed then delete
        otpRepository.findByEmail(email).ifPresent(otpRepository::delete);

        var otp = new Otp();
        otp.setEmail(email);
        otp.setOtp(token);
        otp.setExpiredAt(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(otp);
    }

    @Override
    public void deleteOtp(String email) {
        otpRepository.findByEmail(email).ifPresentOrElse(otpRepository::delete, () -> {
            throw new RuntimeException("Not found otp");
        });
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        Otp otpEntity = otpRepository.findByEmailAndOtp(email, otp).orElseThrow(() -> new AppException(ErrorCode.INVALID_OTP));
        if (otpEntity.getExpiredAt().isBefore(LocalDateTime.now())) {
            deleteOtp(email);
            return false;
        }
        return true;
    }
}