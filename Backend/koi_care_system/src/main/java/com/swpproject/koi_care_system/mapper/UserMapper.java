package com.swpproject.koi_care_system.mapper;


import com.swpproject.koi_care_system.dto.UserDTO;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.payload.request.CreateUserRequest;
import com.swpproject.koi_care_system.payload.request.UpdateUserRequest;
import com.swpproject.koi_care_system.payload.response.LoginResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "provider", constant = "LOCAL")
    @Mapping(target = "orders", ignore = true)
    @Mapping(target = "userProfile", ignore = true)
    @Mapping(target = "cart", ignore = true)
    @Mapping(target = "koiPondList", ignore = true)
    @Mapping(target = "blogs", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "role", constant = "GUEST")
    @Mapping(target = "status", constant = "false")
    User maptoUser(CreateUserRequest createUserRequest);

    UserDTO maptoUserDTO(User user);

    LoginResponse maptoLoginResponse(User user, String token);

    @Mapping(target = "userProfile", ignore = true)
    @Mapping(target = "orders", ignore = true)
    @Mapping(target = "koiPondList", ignore = true)
    @Mapping(target = "blogs", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "id", ignore = true)
    void updateUser(@MappingTarget User user, UpdateUserRequest updateUserRequest);
}