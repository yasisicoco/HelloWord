package com.helloword.logservice.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {

	BAD_REQUEST(400, "잘못된 요청입니다"),
	UNAUTHORIZED(401, "인증이 필요합니다"),
	FORBIDDEN(403, "권한이 없습니다"),
	NOT_FOUND(404, "리소스를 찾을 수 없습니다"),
	METHOD_NOT_ALLOWED(405, "허용되지 않은 HTTP 메서드입니다"),
	NOT_ACCEPTABLE(406, "허용되지 않는 요청입니다"),
	CONFLICT(409, "충돌이 발생했습니다"),
	UNSUPPORTED_MEDIA_TYPE(415, "지원하지 않는 미디어 타입입니다"),
	INTERNAL_SERVER_ERROR(500, "서버 내부 오류가 발생했습니다");

	private int code;
	private String message;
}
