package com.swpproject.koi_care_system.service.user;


import com.swpproject.koi_care_system.dto.UserDTO;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.exception.AppException;
import com.swpproject.koi_care_system.exception.ErrorCode;
import com.swpproject.koi_care_system.mapper.UserMapper;
import com.swpproject.koi_care_system.payload.request.CreateUserRequest;
import com.swpproject.koi_care_system.payload.request.UpdateUserRequest;
import com.swpproject.koi_care_system.repository.UserRepository;
import com.swpproject.koi_care_system.service.UserServiceImpl;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService implements UserServiceImpl {

    UserRepository userRepo;
    UserMapper userMapper;

    public UserDTO createUser(CreateUserRequest request) {


        if (userRepo.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        User user = userMapper.maptoUser(request);
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);//strength to show how password encode complex
        user.setPassword(passwordEncoder.encode(request.getPassword()));

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
