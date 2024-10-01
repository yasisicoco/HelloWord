package com.helloword.gameservice.global.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ExceptionResponse.class)
	public ResponseEntity<?> handlerException(ExceptionResponse e){
		Map<String, String> errorDetails = new HashMap<>();
		errorDetails.put("code", String.valueOf(e.getCustomException().getCode()));
		errorDetails.put("success", "false");
		errorDetails.put("message", e.getCustomException().getMessage());
		return ResponseEntity.status(HttpStatus.valueOf(e.getCustomException().getCode())).body(errorDetails);
	}
}
