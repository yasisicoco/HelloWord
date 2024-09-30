package com.helloword.kidservice.domain.kid.dto.response;

import com.helloword.kidservice.domain.kid.model.Gender;

import java.time.LocalDate;

public record CharacterResponseDto(
        long kidId,
        String name,
        LocalDate birthDate,
        Gender gender,
        String profileImageUrl
) {
}