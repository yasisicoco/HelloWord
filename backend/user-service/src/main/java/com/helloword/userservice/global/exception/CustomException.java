package com.helloword.userservice.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {
    INVALID_EMAIL_FORMAT(400, "InvalidEmailFormatException", "이메일 형식이 올바르지 않습니다"),
    INVALID_PHONE_FORMAT(400, "InvalidPhoneFormatException", "전화번호 형식이 올바르지 않습니다"),
    BAD_REQUEST(400, "BadRequestException", "잘못된 요청입니다"),
    UNAUTHORIZED(401, "UnauthorizedException", "인증이 필요합니다"),
    FORBIDDEN(403, "AccessDeniedException", "권한이 없습니다"),
    NOT_FOUND(404, "NotFoundException", "리소스를 찾을 수 없습니다"),
    METHOD_NOT_ALLOWED(405, "MethodNotAllowedException", "허용되지 않은 HTTP 메서드입니다"),
    NOT_ACCEPTABLE(406, "NotAcceptableException", "허용되지 않는 요청입니다"),
    CONFLICT(409, "ConflictException", "충돌이 발생했습니다"),
    UNSUPPORTED_MEDIA_TYPE(415, "UnsupportedMediaTypeException", "지원하지 않는 미디어 타입입니다"),
    INTERNAL_SERVER_ERROR(500, "InternalServerErrorException", "서버 내부 오류가 발생했습니다");

    private int statusNum;
    private String errorCode;
    private String errorMessage;
}
