package org.helloword.probabilityservice.global.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum CustomException {

	ACCESS_DENIED_EXCEPTION(403,"AccessDeniedException","권한이 없습니다");

	private int statusNum;
	private String errorCode;
	private String errorMessage;
}
