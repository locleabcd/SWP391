package com.swpproject.koi_care_system.controllers;


import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.dto.UserDTO;
import com.swpproject.koi_care_system.payload.request.CreateUserRequest;
import com.swpproject.koi_care_system.payload.request.UpdateUserRequest;
import com.swpproject.koi_care_system.service.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UserController {

	 UserServiceImpl userService;

	@PostMapping("/register")
	ApiResponse<UserDTO> createUser(@RequestBody @Valid CreateUserRequest request) {
		ApiResponse<UserDTO> apiResponse = new ApiResponse<>();
		
		apiResponse.setResult(userService.createUser(request));
		
		return apiResponse;
	}

	@GetMapping
	List<UserDTO> getUsers() {
		return userService.getListUser();
	}

	@GetMapping("/{id}")
    UserDTO findUser(@PathVariable Long id) {
		return userService.findUserByID(id);
	}

	@PutMapping("/{id}")
    UserDTO updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
		return userService.updateUserByID(id, request);
	}

	@DeleteMapping("/{id}")
	String deleteUser(@PathVariable Long id) {
		userService.deleteUserByID(id);
		return "Delete User Success";
	}

}
