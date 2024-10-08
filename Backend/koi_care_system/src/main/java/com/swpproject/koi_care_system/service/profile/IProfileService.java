package com.swpproject.koi_care_system.service.profile;

import com.swpproject.koi_care_system.dto.UserProfileDto;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.models.UserProfile;
import com.swpproject.koi_care_system.payload.request.ProfileUpdateRequest;

import java.io.IOException;

public interface IProfileService {
    UserProfile createProfile(User user);

    UserProfileDto updateProfile(Long idProfile, ProfileUpdateRequest profileUpdateRequest) throws IOException;

    UserProfileDto getProfile(Long userId);
}