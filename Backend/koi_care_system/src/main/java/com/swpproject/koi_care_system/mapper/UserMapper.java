package com.swpproject.koi_care_system.mapper;


import com.swpproject.koi_care_system.dto.request.UserDTO;
import com.swpproject.koi_care_system.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User maptoUser(UserDTO userDTO);
    UserDTO maptoUserDTO(User user);
    void updateUser(@MappingTarget User user, UserDTO userDTO);
}
