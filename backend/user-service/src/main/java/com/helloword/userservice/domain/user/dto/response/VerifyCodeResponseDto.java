package com.helloword.userservice.domain.user.dto.response;

public record VerifyCodeResponseDto(
        boolean emailVerified
) {
}
