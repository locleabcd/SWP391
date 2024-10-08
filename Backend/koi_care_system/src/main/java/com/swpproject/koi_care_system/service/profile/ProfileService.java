package com.swpproject.koi_care_system.service.profile;
import com.swpproject.koi_care_system.dto.UserProfileDto;
import com.swpproject.koi_care_system.enums.ErrorCode;
import com.swpproject.koi_care_system.exceptions.AppException;
import com.swpproject.koi_care_system.mapper.UserProfileMapper;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.models.UserProfile;
import com.swpproject.koi_care_system.payload.request.ProfileUpdateRequest;
import com.swpproject.koi_care_system.repository.UserProfileRepository;
import com.swpproject.koi_care_system.service.imageBlobStorage.ImageStorage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileService implements IProfileService {
    UserProfileMapper userProfileMapper;
    UserProfileRepository userProfileRepository;
    ImageStorage imageStorage;

    @Override
    public UserProfile createProfile(User user) {
        UserProfile userProfile = userProfileMapper.mapToUserProfile(user);
        userProfile.setCreatedDate(LocalDate.now());
        return userProfileRepository.save(userProfile);
    }

    @Override
    @PostAuthorize("returnObject.name == authentication.name")
    public UserProfileDto updateProfile(Long userId, ProfileUpdateRequest profileUpdateRequest) throws IOException {
        UserProfile userProfile = userProfileRepository.findByUserId(userId).orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_FOUND));
        if(profileUpdateRequest.getFile()!=null){
            userProfile.setAvatar(!profileUpdateRequest.getFile().isEmpty()?imageStorage.uploadImage(profileUpdateRequest.getFile()): userProfile.getAvatar());
        }
        userProfileMapper.updateUserProfile(userProfile, profileUpdateRequest);
        //userName
        return userProfileMapper.mapToUserProfileDto(userProfileRepository.save(userProfile));
    }

    @Override
    @PostAuthorize("returnObject.name == authentication.name")
    public UserProfileDto getProfile(Long userId) {
        UserProfile userProfile = userProfileRepository.findByUserId(userId).orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_FOUND));
        return userProfileMapper.mapToUserProfileDto(userProfile);
    }
}