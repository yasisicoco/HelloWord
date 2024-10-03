package com.helloword.wordservice.domain.word.service;

import com.helloword.wordservice.domain.word.dto.response.GameWordResponseDto;
import com.helloword.wordservice.domain.word.model.Word;
import com.helloword.wordservice.domain.word.repository.WordRepository;
import com.helloword.wordservice.global.client.ProbabilityServiceClient;
import com.helloword.wordservice.global.exception.MainException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static com.helloword.wordservice.global.exception.CustomException.NOT_FOUND;

@Slf4j
@Service
@RequiredArgsConstructor
public class WordServiceImpl implements WordService {
    private final WordRepository wordRepository;
    private final ProbabilityServiceClient probabilityServiceClient;

    @Transactional(readOnly = true)
    @Override
    public List<Word> getWordListByIds(List<Long> ids) {
        if(ids.isEmpty())
            throw new MainException(NOT_FOUND);
        return wordRepository.findAllById(ids);
    }

    @Override
    public GameWordResponseDto getWordListByKidId(Long kidId, Integer wordCount) {
//        probabilityServiceClient.getAnswerWordLogs(kidId);
        List<Word> words = wordRepository.findAll();
        int count = Math.min(wordCount, words.size());
        List<Word> subListedWords = words.subList(0, count);

        List<GameWordResponseDto.WordDto> wordDtos = new ArrayList<>();
        for (Word word : subListedWords) {
            wordDtos.add(new GameWordResponseDto.WordDto(word.getId(), word.getWord(), word.getImageUrl(),
                word.getVoiceUrl()));
        }

        return new GameWordResponseDto(wordDtos);
    }

    @Override
    public List<Word> getAllWords() {
        return wordRepository.findAll();
    }
}
