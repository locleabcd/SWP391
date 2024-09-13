package com.swpproject.koi_care_system.service.imp;


import com.swpproject.koi_care_system.dto.request.UserDTO;
import com.swpproject.koi_care_system.entity.User;
import com.swpproject.koi_care_system.exception.AppException;
import com.swpproject.koi_care_system.exception.ErrorCode;
import com.swpproject.koi_care_system.mapper.UserMapper;
import com.swpproject.koi_care_system.repository.UserRepository;
import com.swpproject.koi_care_system.service.UserService;
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
public class UserServiceImpl implements UserService {

    UserRepository userRepo;
    UserMapper userMapper;

    public UserDTO createUser(UserDTO request) {


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

    public UserDTO updateUserByID(Long id, UserDTO request) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userMapper.updateUser(user, request);
        return userMapper.maptoUserDTO(userRepo.save(user));
    }

    public void deleteUserByID(Long id) {
        userRepo.deleteById(id);
    }
}
