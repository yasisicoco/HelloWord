package com.helloword.apigateway.exception;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;

@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    @ExceptionHandler(MainException.class)
    public ResponseEntity<ErrorResponse> handleMainException(
            MainException e) throws IOException {

        CustomException code = e.getErrorCode();

        ErrorResponse errorResponse =
                new ErrorResponse(
                        code.getCode(),
                        code.getMessage());

        return ResponseEntity.status(HttpStatus.valueOf(code.getCode())).body(errorResponse);
    }

    @ExceptionHandler(Throwable.class)
    protected ResponseEntity<ErrorResponse> handleGlobalException(Exception e)
            throws IOException {

        log.error("INTERNAL_SERVER_ERROR", e);
        CustomException internalServerError = CustomException.INTERNAL_SERVER_ERROR;
        ErrorResponse errorResponse =
                new ErrorResponse(
                        internalServerError.getCode(),
                        internalServerError.getMessage());

        return ResponseEntity.status(HttpStatus.valueOf(internalServerError.getCode()))
                .body(errorResponse);
    }
}
