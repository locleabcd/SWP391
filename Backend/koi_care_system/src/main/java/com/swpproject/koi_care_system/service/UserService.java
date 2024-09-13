package com.swpproject.koi_care_system.service;

import com.swpproject.koi_care_system.dto.request.UserDTO;

import java.util.List;


public interface UserService {
    UserDTO createUser(UserDTO request);

    List<UserDTO> getListUser();

    UserDTO findUserByID(Long userID);

    UserDTO updateUserByID(Long id, UserDTO request);

    void deleteUserByID(Long id);
}
