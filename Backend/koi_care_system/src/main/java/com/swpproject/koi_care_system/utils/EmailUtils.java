package com.swpproject.koi_care_system.utils;

public class EmailUtils {

    public static String getVerificationUrl(String email, String token) {
        return "http://localhost:8080/api/auth/verifyEmail?email=" + email + "&token=" + token;
    }
}

