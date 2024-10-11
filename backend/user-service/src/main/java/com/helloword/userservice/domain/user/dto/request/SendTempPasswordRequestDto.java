package com.helloword.userservice.domain.user.dto.request;

public record SendTempPasswordRequestDto(
    String email,
    String username
) {
}
