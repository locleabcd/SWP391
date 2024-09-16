package com.swpproject.koi_care_system.service.user;

import com.swpproject.koi_care_system.dto.UserDto;
import com.swpproject.koi_care_system.model.User;
import com.swpproject.koi_care_system.dto.request.CreateUserRequest;
import com.swpproject.koi_care_system.dto.request.UserUpdateRequest;

public interface IUserService {

    User getUserById(Long userId);
    User createUser(CreateUserRequest request);
    User updateUser(UserUpdateRequest request, Long userId);
    void deleteUser(Long userId);

    UserDto convertUserToDto(User user);
}
