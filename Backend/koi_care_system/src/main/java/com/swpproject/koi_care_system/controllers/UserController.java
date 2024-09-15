package com.swpproject.koi_care_system.controllers;


import com.swpproject.koi_care_system.dto.UserDTO;
import com.swpproject.koi_care_system.payload.request.CreateUserRequest;
import com.swpproject.koi_care_system.payload.request.UpdateUserRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserServiceImpl userService;

    @PostMapping("/register")
    ApiResponse<UserDTO> createUser(@RequestBody @Valid CreateUserRequest request) {
        ApiResponse<UserDTO> apiResponse = new ApiResponse<>();

        apiResponse.setResult(userService.createUser(request));

        return apiResponse;
    }

    @GetMapping
    ApiResponse<List<UserDTO>> getUsers() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info("User: {}", authentication.getName());
        authentication.getAuthorities().forEach(a -> log.info("Role: {}", a.getAuthority()));
        ApiResponse<List<UserDTO>> apiResponse = new ApiResponse<>();

        apiResponse.setResult(userService.getListUser());
        return apiResponse;
    }

    @GetMapping("/{id}")
    ApiResponse<UserDTO> findUser(@PathVariable Long id) {
        ApiResponse<UserDTO> apiResponse = new ApiResponse<>();
        apiResponse.setResult(userService.findUserByID(id));
        return apiResponse;
    }

    @PutMapping("/{id}")
    ApiResponse<UserDTO> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        return ApiResponse.<UserDTO>builder()
                .result(userService.updateUserByID(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<String> deleteUser(@PathVariable Long id) {
        userService.deleteUserByID(id);
        return ApiResponse.<String>builder()
                .result("User has been deleted")
                .build();
    }

}
