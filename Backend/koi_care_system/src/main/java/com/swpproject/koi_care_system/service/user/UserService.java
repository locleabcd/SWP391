package com.swpproject.koi_care_system.service.user;


import com.swpproject.koi_care_system.dto.UserDTO;
import com.swpproject.koi_care_system.enums.ErrorCode;
import com.swpproject.koi_care_system.enums.Role;
import com.swpproject.koi_care_system.exceptions.AppException;
import com.swpproject.koi_care_system.mapper.UserMapper;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.payload.request.CreateUserRequest;
import com.swpproject.koi_care_system.payload.request.UpdateUserRequest;
import com.swpproject.koi_care_system.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService implements IUserService {

    UserRepository userRepo;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    public UserDTO createUser(CreateUserRequest request) {


        if (userRepo.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        User user = userMapper.maptoUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        //HashSet is used to save user roles and ensure that there are no duplicate roles
        HashSet<String> roles = new HashSet<>();
        roles.add(Role.MEMBER.name());
        user.setRoles(roles);

        return userMapper.maptoUserDTO(userRepo.save(user));

    }

    public List<UserDTO> getListUser() {
        return userRepo.findAll().stream()
                .map(userMapper::maptoUserDTO).toList();

    }

    public UserDTO findUserByID(Long userID) {
        return userMapper.maptoUserDTO(userRepo.findById(userID).orElseThrow(() -> new RuntimeException("User Not Found")));
    }

    public UserDTO updateUserByID(Long id, UpdateUserRequest request) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userMapper.updateUser(user, request);
        return userMapper.maptoUserDTO(userRepo.save(user));
    }

    public void deleteUserByID(Long id) {
        userRepo.deleteById(id);
    }
}
