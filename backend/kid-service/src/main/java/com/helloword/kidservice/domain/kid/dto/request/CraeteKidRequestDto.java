    package com.helloword.kidservice.domain.kid.dto.request;

    import com.helloword.kidservice.domain.kid.model.Gender;

    import java.time.LocalDate;

    public record CraeteKidRequestDto(
            String name,
            LocalDate birthDate,
            Gender gender
    ) {
    }
