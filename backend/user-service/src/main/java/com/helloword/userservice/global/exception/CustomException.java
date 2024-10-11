package com.helloword.userservice.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {
    INVALID_EMAIL_FORMAT(400, "이메일 형식이 올바르지 않습니다"),
    INVALID_PHONE_FORMAT(400, "전화번호 형식이 올바르지 않습니다"),
    VERIFICATION_CODE_EXPIRED(400, "인증번호가 만료되었습니다"),
    VERIFICATION_CODE_MISMATCH(400, "인증번호가 일치하지 않습니다"),
    EMAIL_MISMATCH(400, "입력한 이메일 정보가 유효하지 않습니다"),
    BAD_REQUEST(400, "잘못된 요청입니다"),
    UNAUTHORIZED(401, "인증이 필요합니다"),
    FORBIDDEN(403, "권한이 없습니다"),
    NOT_FOUND(404, "리소스를 찾을 수 없습니다"),
    NOT_FOUND_EMAIL(404, "이메일을 찾을 수 없습니다"),
    METHOD_NOT_ALLOWED(405, "허용되지 않은 HTTP 메서드입니다"),
    NOT_ACCEPTABLE(406, "허용되지 않는 요청입니다"),
    CONFLICT(409, "충돌이 발생했습니다"),
    DUPLICATE_EMAIL(409, "이미 사용 중인 이메일입니다"),
    DUPLICATE_PHONE(409, "이미 사용 중인 전화번호입니다"),
    EMAIL_ALREADY_VERIFIED(409, "이 이메일은 이미 인증되었습니다"),
    UNSUPPORTED_MEDIA_TYPE(415, "지원하지 않는 미디어 타입입니다"),
    EMAIL_SEND_FAILED(500, "이메일 전송에 실패했습니다"),
    INTERNAL_SERVER_ERROR(500, "서버 내부 오류가 발생했습니다");

    private int code;
    private String message;
}