package com.swpproject.koi_care_system.ultis;

public class EmailUtils {
    public static String getVerificationUrl(String email, String token) {
        return "https://koicaresystem.azurewebsites.net/api/auth/verify?email=" + email + "&token=" + token+ "&redirect=https://koicaresystem.azurewebsites.net/login";
    }
}