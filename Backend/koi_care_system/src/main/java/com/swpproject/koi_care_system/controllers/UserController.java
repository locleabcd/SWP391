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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    IUserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> createUser(@RequestBody @Valid CreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder()
                .message("User has been created")
                .data(userService.createUser(request))
                .build());
    }

    @PostMapping("/register/staff")
    public ResponseEntity<ApiResponse> createStaff(@RequestBody @Valid CreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder()
                .message("Staff has been created")
                .data(userService.createStaff(request))
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getUsers() {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("List of users")
                .data(userService.getListUser())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> findUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("User found")
                .data(userService.findUserByID(id))
                .build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("User has been updated")
                .data(userService.updateUserByID(id, request))
                .build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        userService.deleteUserByID(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("User has been deleted")
                .build());
    }

}