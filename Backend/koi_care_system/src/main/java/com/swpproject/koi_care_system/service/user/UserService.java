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
import com.swpproject.koi_care_system.service.authentication.IAuthenticationService;
import com.swpproject.koi_care_system.service.email.IEmailService;
import com.swpproject.koi_care_system.service.profile.ProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService implements IUserService {

    UserRepository userRepo;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;
    IEmailService emailService;
    IAuthenticationService authenticationService;
    ProfileService profileService;

    public UserDTO createUser(CreateUserRequest request) {
        if (userRepo.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        } else if (userRepo.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        User user = userMapper.maptoUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        var token = authenticationService.generateToken(user);
        emailService.send(user.getUsername(), user.getEmail(), "Welcome New User, Your Verify Email", token);

        return userMapper.maptoUserDTO(userRepo.save(user));
    }

    public List<UserDTO> getListUser() {
        return userRepo.findAll().stream()
                .map(userMapper::maptoUserDTO).toList();
    }

    @PostAuthorize("returnObject.username == authentication.name")
    public UserDTO findUserByID(Long userID) {
        return userMapper.maptoUserDTO(userRepo.findById(userID).orElseThrow(() -> new RuntimeException("User Not Found")));
    }

    public UserDTO updateUserByID(Long id, UpdateUserRequest request) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        request.setPassword(passwordEncoder.encode(request.getPassword()));
        userMapper.updateUser(user, request);
        return userMapper.maptoUserDTO(userRepo.save(user));
    }

    public void deleteUserByID(Long id) {
        userRepo.findById(id).ifPresentOrElse(userRepo::delete, () -> {
            throw new RuntimeException("User not found");
        });
    }

    @Override
    public void verifyUser(String email, String token) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setStatus(true);
        user.setRole(Role.MEMBER);
        user.setUserProfile(profileService.createProfile(user));
        userRepo.save(user);
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    public UserDTO createStaff(CreateUserRequest request) {
        if (userRepo.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        } else if (userRepo.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        User user = userMapper.maptoUser(request);
        user.setEmail(request.getUsername() + "@koicare.comany.vn");
        user.setPassword(passwordEncoder.encode("ABC@123"));
        user.setRole(Role.SHOP);
        user.setStatus(true);
        userRepo.save(user);
        user.setUserProfile(profileService.createProfile(user));
        return userMapper.maptoUserDTO(userRepo.save(user));
    }
}
