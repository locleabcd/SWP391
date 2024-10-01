package com.swpproject.koi_care_system.exceptions;

import com.swpproject.koi_care_system.enums.ErrorCode;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandle {

	@ExceptionHandler(value = Exception.class)
	ResponseEntity<ApiResponse> handlingRuntimeException(Exception exception) {
		ApiResponse apiResponse = new ApiResponse();

		apiResponse.setMessage(exception.getMessage());
		return ResponseEntity.status(500).body(apiResponse);
	}

	@ExceptionHandler(value = AppException.class)
	ResponseEntity<ApiResponse> handlingAppException(AppException exception) {
		ErrorCode errorCode = exception.getErrorCode();
		ApiResponse apiResponse = new ApiResponse();

		apiResponse.setData(errorCode);
		apiResponse.setMessage(errorCode.getMessage());


		return ResponseEntity.status(errorCode.getStatus()).body(apiResponse);
	}

	@ExceptionHandler(value = MethodArgumentNotValidException.class)
	ResponseEntity<ApiResponse> handlingValidation(MethodArgumentNotValidException exception) {
		ApiResponse apiResponse = new ApiResponse();
		if (exception.getFieldError() != null) {
			String enumKey = exception.getFieldError().getDefaultMessage();
			ErrorCode errorCode = ErrorCode.valueOf(enumKey);

			apiResponse.setMessage(errorCode.getMessage());

		} else {
			apiResponse.setMessage("Validation error");
		}

		return ResponseEntity.badRequest().body(apiResponse);
	}

	@ExceptionHandler(value = AccessDeniedException.class)
	public ResponseEntity<String> handleAccessDeniedException(AccessDeniedException ex) {
		ErrorCode errorCode = ErrorCode.UNAUTHORIZED;

		return ResponseEntity.status(errorCode.getStatus()).body(errorCode.getMessage());
	}

}