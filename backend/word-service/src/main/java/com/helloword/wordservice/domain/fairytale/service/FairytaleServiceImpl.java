package com.helloword.wordservice.domain.fairytale.service;

import com.helloword.wordservice.domain.fairytale.dto.response.FairytaleResponseDto;
import com.helloword.wordservice.domain.fairytale.model.Fairytale;
import com.helloword.wordservice.domain.fairytale.model.FairytaleSentence;
import com.helloword.wordservice.domain.fairytale.repository.FairytaleRepository;
import com.helloword.wordservice.domain.fairytale.repository.FairytaleSentenceRepository;
import com.helloword.wordservice.domain.word.model.Word;
import com.helloword.wordservice.domain.word.repository.WordRepository;
import com.helloword.wordservice.global.exception.CustomException;
import com.helloword.wordservice.global.exception.ErrorResponse;
import com.helloword.wordservice.global.exception.MainException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FairytaleServiceImpl implements FairytaleService {

    private final FairytaleRepository fairytaleRepository;
    private final FairytaleSentenceRepository fairytaleSentenceRepository;
    private final WordRepository wordRepository;

    @Override
    public FairytaleResponseDto getFairytale() {
        Fairytale fairytale = fairytaleRepository.findRandomFairytale()
            .orElseThrow(() -> new MainException(CustomException.NOT_FOUND));

        List<FairytaleSentence> sentences = fairytaleSentenceRepository.findByFairytaleId(fairytale.getId());

        int sentenceCount = sentences.size();

        List<FairytaleResponseDto.Sentence> sentenceDtos = sentences.stream()
            .map(sentence -> {
                Word correctWord = sentence.getWord();
                return new FairytaleResponseDto.Sentence(
                    sentence.getSentence(),
                    sentence.getImageUrl(),
                    sentence.getSequence(),
                    new FairytaleResponseDto.Word(correctWord.getWord(), correctWord.getId())
                );
            })
            .collect(Collectors.toList());

        List<Long> correctWordIds = sentences.stream()
            .map(FairytaleSentence::getWord)
            .map(Word::getId)
            .collect(Collectors.toList());

        List<FairytaleResponseDto.Word> incorrectWords = wordRepository.findRandomWordsExcluding(correctWordIds, 3 * sentenceCount).stream()
            .map(word -> new FairytaleResponseDto.Word(word.getWord(), word.getId()))
            .collect(Collectors.toList());

        return new FairytaleResponseDto(
            fairytale.getTitle(),
            sentenceCount,
            sentenceDtos,
            incorrectWords
        );
    }
}
