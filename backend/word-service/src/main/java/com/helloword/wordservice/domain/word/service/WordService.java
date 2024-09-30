package com.helloword.wordservice.domain.word.service;

import com.helloword.wordservice.domain.word.model.Word;

import java.util.List;

public interface WordService {
    List<Word> getWordListByIds(List<Long> ids);

    List<Word> getWordListByKidId(Long kidId);
}
