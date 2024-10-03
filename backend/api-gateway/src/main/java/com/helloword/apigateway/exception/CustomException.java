package com.helloword.apigateway.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {


    INVALID_TOKEN(401, "유효하지 않은 JWT 토큰입니다."),
    EXPIRED_TOKEN(401,"만료된 JWT 토큰입니다."),
    INTERNAL_SERVER_ERROR(500, "서버 내부 오류가 발생했습니다");

    private int code;
    private String message;
}