package com.swpproject.koi_care_system.ultis;

public class EmailUtils {
    public static String getVerificationUrl(String email, String token) {
        return "https://koi-care-system.azurewebsites.net/api/auth/verify?email=" + email + "&token=" + token+ "&redirect=https://koi-care-system.azurewebsites.net/login";
    }
}

