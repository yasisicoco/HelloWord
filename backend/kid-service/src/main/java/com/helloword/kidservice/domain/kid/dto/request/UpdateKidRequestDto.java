package com.helloword.kidservice.domain.kid.dto.request;

import com.helloword.kidservice.domain.kid.model.Gender;
import com.helloword.kidservice.global.exception.MainException;

import java.time.LocalDate;

import static com.helloword.kidservice.global.exception.CustomException.REQUIRED_VALUE_MISSING;

public record UpdateKidRequestDto(
        String name,
        LocalDate birthDate,
        Gender gender
) {
    public UpdateKidRequestDto {
        if (name == null) {
            throw new MainException(REQUIRED_VALUE_MISSING);
        }
        if (birthDate == null) {
            throw new MainException(REQUIRED_VALUE_MISSING);
        }
    }
}
