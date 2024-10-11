package com.helloword.collectionservice.global.response;

import lombok.Getter;

@Getter
public class SuccessResponse {
	private final boolean success = true;
	private final int code;
	private final Object data;

	public SuccessResponse(int code, Object data) {
		this.code = code;
		this.data = data;
	}
}
