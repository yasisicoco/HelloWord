package com.helloword.userservice.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MainException extends RuntimeException {

    private CustomException errorCode;
}
