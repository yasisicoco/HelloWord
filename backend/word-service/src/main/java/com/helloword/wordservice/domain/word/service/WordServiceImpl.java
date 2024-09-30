package com.helloword.wordservice.domain.word.service;

import com.helloword.wordservice.domain.word.model.Word;
import com.helloword.wordservice.domain.word.repository.WordRepository;
import com.helloword.wordservice.global.exception.MainException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.helloword.wordservice.global.exception.CustomException.NOT_FOUND;

@Slf4j
@Service
@RequiredArgsConstructor
public class WordServiceImpl implements WordService {
    private final WordRepository wordRepository;

    @Transactional(readOnly = true)
    @Override
    public List<Word> getWordListByIds(List<Long> ids) {
        if(ids.isEmpty())
            throw new MainException(NOT_FOUND);
        return wordRepository.findAllById(ids);
    }

    @Override
    public List<Word> getWordListByKidId(Long kidId) {
        return List.of();
    }
}
