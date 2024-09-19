package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.payload.request.CreateUserRequest;
import com.swpproject.koi_care_system.payload.request.UpdateUserRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.user.IUserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    IUserService userService;

    @PostMapping("/register")
    ApiResponse createUser(@RequestBody @Valid CreateUserRequest request) {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setData(userService.createUser(request));
        return apiResponse;
    }
    @GetMapping
    ApiResponse getUsers() {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setData(userService.getListUser());
        return apiResponse;
    }

    @GetMapping("/{id}")
    ApiResponse findUser(@PathVariable Long id) {
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setData(userService.findUserByID(id));
        return apiResponse;
    }

    @PutMapping("/{id}")
    ApiResponse updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        return ApiResponse.builder()
                .data(userService.updateUserByID(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse deleteUser(@PathVariable Long id) {
        userService.deleteUserByID(id);
        return ApiResponse.builder()
                .data("User has been deleted")
                .build();
    }

}
