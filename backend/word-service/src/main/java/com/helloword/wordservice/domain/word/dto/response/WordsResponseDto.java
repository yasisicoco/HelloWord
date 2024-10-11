package com.helloword.wordservice.domain.word.dto.response;

import com.helloword.wordservice.domain.word.model.Word;

import java.util.List;

public record WordsResponseDto(
        List<WordData> words
) {
    public record WordData(
            Long wordId,
            String word,
            String imageUrl,
            String voiceUrl
    ) {
        public WordData(Word word) {
            this(
                    word.getId(),
                    word.getWord(),
                    word.getImageUrl(),
                    word.getVoiceUrl()
            );
        }
    }
}
