package com.swpproject.koi_care_system.mapper;


import com.swpproject.koi_care_system.dto.UserDTO;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.payload.request.CreateUserRequest;
import com.swpproject.koi_care_system.payload.request.UpdateUserRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User maptoUser(CreateUserRequest createUserRequest);
    UserDTO maptoUserDTO(User user);
    void updateUser(@MappingTarget User user, UpdateUserRequest updateUserRequest);
}
