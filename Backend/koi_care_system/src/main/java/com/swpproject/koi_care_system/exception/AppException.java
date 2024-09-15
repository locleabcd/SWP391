package com.swpproject.koi_care_system.exception;

import com.swpproject.koi_care_system.enums.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppException extends RuntimeException{
	private ErrorCode errorCode;

	
}
