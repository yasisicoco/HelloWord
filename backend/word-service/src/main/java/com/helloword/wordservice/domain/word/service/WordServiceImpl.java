package com.helloword.wordservice.domain.word.service;

import com.helloword.wordservice.domain.recognitionrate.model.RecognitionRate;
import com.helloword.wordservice.domain.recognitionrate.repository.RecognitionRateRepository;
import com.helloword.wordservice.domain.word.dto.response.GameWordResponseDto;
import com.helloword.wordservice.domain.word.model.AnswerWordLog;
import com.helloword.wordservice.domain.word.model.Word;
import com.helloword.wordservice.domain.word.repository.WordRepository;
import com.helloword.wordservice.global.client.KidServiceClient;
import com.helloword.wordservice.global.client.ProbabilityServiceClient;
import com.helloword.wordservice.global.exception.MainException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import static com.helloword.wordservice.global.exception.CustomException.NOT_FOUND;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WordServiceImpl implements WordService {
    private final WordRepository wordRepository;
    private final ProbabilityServiceClient probabilityServiceClient;
    private final KidServiceClient kidServiceClient;
    private final RecognitionRateRepository recognitionRateRepository;

    @Override
    public List<Word> getWordListByIds(List<Long> ids) {
        if (ids.isEmpty())
            throw new MainException(NOT_FOUND);
        return wordRepository.findAllById(ids);
    }

    @Override
    public GameWordResponseDto getWordListByKidId(Long kidId, Integer wordCount) {

        Integer kidMonth = kidServiceClient.getKidAgeById(kidId);
        kidMonth = Math.min(Math.max(kidMonth, 18), 36);

        List<RecognitionRate> recognitionRates = recognitionRateRepository.findAllByMonth(kidMonth);
        List<AnswerWordLog> answerWordLogs = probabilityServiceClient.getAnswerWordLogs(kidId).answerWordLogs();

        HashMap<Long, Float> recognitionRateHashMap = new HashMap<>();
        for (RecognitionRate recognitionRate : recognitionRates) {
            recognitionRateHashMap.put(recognitionRate.getId(), recognitionRate.getRate());
        }
        List<ComputedWord> resultWords = new ArrayList<>();
        for (AnswerWordLog answerWordLog : answerWordLogs) {
            Float rate = recognitionRateHashMap.get(answerWordLog.wordId());
            Double computedScore = rate * answerWordLog.probability();
            resultWords.add(new ComputedWord(answerWordLog.wordId(), computedScore));
        }

        resultWords.sort((o1, o2) -> Double.compare(o2.value, o1.value));

        List<Word> words = wordRepository.findAllById(resultWords.stream().map(resultWord -> resultWord.id).toList());
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

    private static class ComputedWord {
        Long id;
        Double value;

        public ComputedWord(Long id, Double value) {
            this.id = id;
            this.value = value;
        }
    }
}
