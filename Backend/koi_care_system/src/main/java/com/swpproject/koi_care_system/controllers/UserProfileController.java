package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.payload.request.ProfileUpdateRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.profile.ProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileController {
    ProfileService profileService;
    @PutMapping("/update/{userId}")
    public ResponseEntity<ApiResponse> updateProfile(@PathVariable Long userId, @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Profile has been updated")
                .data(profileService.updateProfile(userId, request))
                .build());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse> getProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Profile found")
                .data(profileService.getProfile(userId))
                .build());
    }
}