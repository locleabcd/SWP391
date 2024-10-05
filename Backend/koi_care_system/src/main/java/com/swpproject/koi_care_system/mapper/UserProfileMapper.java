package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.UserProfileDto;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.models.UserProfile;
import com.swpproject.koi_care_system.payload.request.ProfileUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", source = "user")
    @Mapping(target = "phone", ignore = true)
    @Mapping(target = "name", source = "user.username")
    @Mapping(target = "gender", ignore = true)
    @Mapping(target = "dateOfBirth", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "bio", ignore = true)
    @Mapping(target = "avatar", ignore = true)
    @Mapping(target = "address", ignore = true)
    @Mapping(target = "status", constant = "NORMAL")
    UserProfile mapToUserProfile(User user);

    UserProfileDto mapToUserProfileDto(UserProfile userProfile);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    void updateUserProfile(@MappingTarget UserProfile userProfile, ProfileUpdateRequest profileUpdateRequest);

}