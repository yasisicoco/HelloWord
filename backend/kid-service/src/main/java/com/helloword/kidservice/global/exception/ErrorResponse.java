package com.helloword.kidservice.global.exception;

import lombok.Getter;

@Getter
public class ErrorResponse {

    private final boolean success = false;
    private final int code;
    private final String reason;


    public ErrorResponse(int code, String reason) {
        this.code = code;
        this.reason = reason;
    }
}
