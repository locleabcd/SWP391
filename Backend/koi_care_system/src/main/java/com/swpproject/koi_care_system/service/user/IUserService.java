package com.swpproject.koi_care_system.service.user;

import com.swpproject.koi_care_system.dto.UserDTO;
import com.swpproject.koi_care_system.payload.request.ChangePasswordRequest;
import com.swpproject.koi_care_system.payload.request.CreateUserRequest;
import com.swpproject.koi_care_system.payload.request.UpdateUserRequest;

import java.security.Principal;
import java.util.List;


public interface IUserService {
    UserDTO createUser(CreateUserRequest request);

    List<UserDTO> getListUser();

    UserDTO findUserByID(Long userID);

    UserDTO updateUserByID(Long id, UpdateUserRequest request);

    void deleteUserByID(Long id);

    void verifyUser(String email, String token);

    UserDTO createStaff(CreateUserRequest request);

    void changePassword(ChangePasswordRequest request, Principal connectedUser);

}
