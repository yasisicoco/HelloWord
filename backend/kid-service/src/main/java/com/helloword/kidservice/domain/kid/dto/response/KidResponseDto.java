package com.helloword.kidservice.domain.kid.dto.response;

import com.helloword.kidservice.domain.kid.model.Character;
import com.helloword.kidservice.domain.kid.model.Gender;
import com.helloword.kidservice.domain.kid.model.Kid;

import java.time.LocalDate;

public record KidResponseDto(
        long kidId,
        String name,
        LocalDate birthDate,
        Gender gender,
        String profileImageUrl,
        Character mainCharacter,
        int level,
        int experience
) {
    public KidResponseDto(Kid kid) {
        this(kid.getId(), kid.getName(), kid.getBirthDate(), kid.getGender(), kid.getProfileImageUrl(),
                kid.getMainCharacter(), kid.getLevel(), kid.getExperience());
    }
}