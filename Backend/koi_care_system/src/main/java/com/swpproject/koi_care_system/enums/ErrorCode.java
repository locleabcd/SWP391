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
    NO_ROLES(1006, "User has no roles");


    private int code;
    private String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
