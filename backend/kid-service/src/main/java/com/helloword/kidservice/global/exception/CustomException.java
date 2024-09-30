package com.helloword.kidservice.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {

    INVALID_FILE_EXTENSION(400, "유효하지 않은 파일 확장자입니다"),
    NOT_FOUND(404, "리소스를 찾을 수 없습니다"),
    FILE_SIZE_EXCEEDED(413, "업로드된 파일 크기가 허용된 한도를 초과했습니다"),
    INTERNAL_SERVER_ERROR(500, "서버 내부 오류가 발생했습니다"),
    FILE_UPLOAD_FAILED(500, "파일 업로드에 실패했습니다");

    private int code;
    private String message;
}