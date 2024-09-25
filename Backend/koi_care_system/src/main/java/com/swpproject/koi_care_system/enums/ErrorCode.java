package com.swpproject.koi_care_system.enums;

import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@FieldDefaults(makeFinal = true)
public enum ErrorCode {
    USER_EXISTED(1001, "User Existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1002, "Username must be at least 3 character", HttpStatus.BAD_REQUEST),
    USER_PASSWORD(1003, "User password must at least 8 character", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1004, "User not available", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1005, "User unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1012, "Do Not Have Permission", HttpStatus.FORBIDDEN),
    NO_ROLES(1006, "User has no roles", HttpStatus.FORBIDDEN),
    EMAIL_EXISTED(1007, "Email Existed", HttpStatus.BAD_REQUEST),
    SENDMAIL_FAILED(1008, "Send mail failed", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_TOKEN(1009, "Invalid Token", HttpStatus.BAD_REQUEST),
    TAG_EXISTED(1009, "Tag Existed", HttpStatus.BAD_REQUEST),
    TAG_DESCRIPTION_EXISTED(1010, "Tag Duplicated Description", HttpStatus.BAD_REQUEST),
    INVALID_OTP(1011, "Invalid OTP for email", HttpStatus.BAD_REQUEST),
    ;


    private int code;
    private String message;
    private HttpStatus status;

    ErrorCode(int code, String message, HttpStatus status) {
        this.code = code;
        this.message = message;
        this.status = status;
    }
}