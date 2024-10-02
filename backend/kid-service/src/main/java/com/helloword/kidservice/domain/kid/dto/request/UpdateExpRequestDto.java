package com.helloword.kidservice.domain.kid.dto.request;

public record UpdateExpRequestDto(
        Long kidId,
        Integer exp
) {
}
