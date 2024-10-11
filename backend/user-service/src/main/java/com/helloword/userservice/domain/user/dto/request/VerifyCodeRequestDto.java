package com.helloword.userservice.domain.user.dto.request;

public record VerifyCodeRequestDto(
        String email,
        String code
) {
}
