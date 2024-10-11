package com.helloword.wordservice.domain.fairytale.dto.response;

import java.util.List;

public record FairytaleResponseDto(
        String storyTitle,
        Integer sentenceCount,
        List<Sentence> sentences,
        List<Word> incorrectWords
) {
    public record Sentence(String sentence, String imageUrl, Integer sentenceOrder, Word correctWord) { }
    public record Word(String word, Long wordId) { }
}
