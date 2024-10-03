package com.helloword.wordservice.domain.word.service;

import com.helloword.wordservice.domain.word.dto.response.GameWordResponseDto;
import com.helloword.wordservice.domain.word.model.Word;

import java.util.List;

public interface WordService {
    List<Word> getWordListByIds(List<Long> ids);

    GameWordResponseDto getWordListByKidId(Long kidId, Integer wordCount);

    List<Word> getAllWords();

    void init();
}
