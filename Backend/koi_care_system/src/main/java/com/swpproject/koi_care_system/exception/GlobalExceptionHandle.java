package com.swpproject.koi_care_system.exception;

import com.swpproject.koi_care_system.enums.ErrorCode;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandle {

	@ExceptionHandler(value = Exception.class)
	ResponseEntity<ApiResponse> handlingRuntimeException(Exception exception) {
	    ApiResponse apiResponse = new ApiResponse<>();
	
		apiResponse.setCode(9999);
		apiResponse.setMessage(exception.getMessage());
	    return ResponseEntity.status(500).body(apiResponse);
	}
	
	@ExceptionHandler(value = AppException.class)
	ResponseEntity<ApiResponse> handlingAppException(AppException exception) {
		ErrorCode errorCode = exception.getErrorCode();
		ApiResponse apiResponse = new ApiResponse<>();
	
		apiResponse.setCode(errorCode.getCode());
		apiResponse.setMessage(errorCode.getMessage());

	
		return ResponseEntity.badRequest().body(apiResponse);
	}
	
	@ExceptionHandler(value = MethodArgumentNotValidException.class)
	ResponseEntity<ApiResponse> handlingValidation(MethodArgumentNotValidException exception) {
		ApiResponse apiResponse = new ApiResponse<>();
		if (exception.getFieldError() != null) {
			String enumKey = exception.getFieldError().getDefaultMessage();
			ErrorCode errorCode = ErrorCode.valueOf(enumKey);
	
			apiResponse.setCode(errorCode.getCode());
			apiResponse.setMessage(errorCode.getMessage());

		} else {
			apiResponse.setCode(9999); // Default error code
			apiResponse.setMessage("Validation error");
		}
	
		return ResponseEntity.badRequest().body(apiResponse);
	}

}
