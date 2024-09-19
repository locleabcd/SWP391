package com.swpproject.koi_care_system.enums;

import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(makeFinal = true)
public enum ErrorCode {
    USER_EXISTED(1001, "User Existed"),
    USERNAME_INVALID(1002, "Username must be at least 3 character"),
    USER_PASSWORD(1003, "User password must at least 8 character"),
    USER_NOT_EXISTED(1004, "User not available"),
    UNAUTHENTICATED(1005, "User unauthenticated"),
    NO_ROLES(1006, "User has no roles"),
    EMAIL_EXISTED(1007, "Email Existed"),
    SENDMAIL_FAILED(1008, "Send mail failed"),
    INVALID_TOKEN(1009, "Invalid Token"),
    TAG_EXISTED(1009, "Tag Existed"),
    TAG_DESCRIPTION_EXISTED(1010, "Tag Duplicated Description");


    private int code;
    private String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
