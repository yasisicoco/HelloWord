package com.helloword.wordservice.domain.word.controller;

import com.helloword.wordservice.domain.word.model.Word;
import com.helloword.wordservice.domain.word.service.WordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/words")
@RequiredArgsConstructor
@Tag(name = "단어 API", description = "단어, 동화 API에 대한 설명입니다.")
public class WordController {
    private final WordService wordService;

    @Operation(summary = "해당 단어리스트 조회", description = "요청받은 단어 아이디 리스트를 상세 단어 리스트로 반환합니다.")
    @PostMapping("/details")
    public List<Word> getWordDetails(@RequestBody List<Long> wordIds) {
        List<Word> wordDetails = wordService.getWordListByIds(wordIds);
        return wordDetails;
    }

    @Operation(summary = "해당 단어리스트 조회", description = "kidId에 해당하는 단어를 조회하고 계산하여 반환합니다.")
    @GetMapping("/kids/{kidId}")
    public List<Word> getWordDetailsBykidIds(@PathVariable Long kidId) {
        List<Word> wordDetails = wordService.getWordListByKidId(kidId);
        return wordDetails;
    }

}
