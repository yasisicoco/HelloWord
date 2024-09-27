package com.helloword.wordservice.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {

    NOT_FOUND(404, "리소스를 찾을 수 없습니다"),

    INTERNAL_SERVER_ERROR(500, "서버 내부 오류가 발생했습니다");

    private int code;
    private String message;
}