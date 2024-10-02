package com.helloword.wordservice.domain.word.model;

public record AnswerWordLog(
        Long id,
        Long kidId,
        Long wordId,
        Double probability
) {
}
