package com.swpproject.koi_care_system.service.user;

import com.swpproject.koi_care_system.dto.UserDTO;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.payload.request.CreateUserRequest;
import com.swpproject.koi_care_system.payload.request.UpdateUserRequest;

import java.util.List;


public interface IUserService {
    UserDTO createUser(CreateUserRequest request);

    List<UserDTO> getListUser();

    UserDTO findUserByID(Long userID);
    User findUserByUserName(String username);

    UserDTO updateUserByID(Long id, UpdateUserRequest request);

    void deleteUserByID(Long id);

    void verifyUser(String email, String token);

    UserDTO convertToDto(User user);

    UserDTO createStaff(CreateUserRequest request);
}
