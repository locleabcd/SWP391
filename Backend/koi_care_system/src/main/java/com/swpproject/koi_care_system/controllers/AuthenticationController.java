package com.swpproject.koi_care_system.controllers;

import com.nimbusds.jose.JOSEException;
import com.swpproject.koi_care_system.payload.request.AuthenticationRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.authentication.AuthenticationService;
import com.swpproject.koi_care_system.service.user.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authService;
    UserService userService;

    @PostMapping("/login")
    ApiResponse authenticate(@RequestBody AuthenticationRequest request){
        var result = authService.authenticate(request);
        return ApiResponse.builder()
                .data(result)
                .build();
    }

    @GetMapping("/verify")
    public String verifyUserEmail(@RequestParam String email, @RequestParam String token) throws ParseException, JOSEException {
        var result = authService.verificationToken(token);
        if (result) {
            userService.verifyUser(email, token);
        }
        return "<html>"
                + "<head>"
                + "<meta http-equiv='refresh' content='0;url=http://localhost:5173/verify'>"
                + "</head>"
                + "<body></body>"
                + "</html>";
    }
}
