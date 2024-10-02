package com.helloword.kidservice.domain.kid.dto.request;

import com.helloword.kidservice.domain.kid.model.Character;

public record UpdateMainCharactorRequestDto(
        Character mainCharacter
) {
}
