package com.helloword.wordservice.domain.word.controller;

import com.helloword.wordservice.domain.fairytale.dto.response.FairytaleResponseDto;
import com.helloword.wordservice.domain.fairytale.service.FairytaleService;
import com.helloword.wordservice.domain.word.dto.response.GameWordResponseDto;
import com.helloword.wordservice.domain.word.model.Word;
import com.helloword.wordservice.domain.word.service.WordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/internal/words")
@RequiredArgsConstructor
@Tag(name = "[내부]단어 API", description = "서버 내부에서 통신하는 단어에 대한 API 입니다.")
public class InternalWordController {
    private final WordService wordService;
    private final FairytaleService fairytaleService;

    @GetMapping("/all")
    @Operation(summary = "모든 단어 조회", description = "모든 단어를 조회합니다.")
    public List<Word> getAllWords() {
        return wordService.getAllWords();
    }

    @GetMapping
    @Operation(summary = "아이 게임 단어 조회", description = "아이에게 출제할 게임 단어를 조회하고 계산하여 반환합니다.")
    public GameWordResponseDto getWordsByKidId(
            @RequestParam Long kidId,
            @RequestParam Integer wordCount
    ) {
        return wordService.getWordListByKidId(kidId, wordCount);
    }

    @GetMapping("/fairytale")
    @Operation(summary = "아이의 동화 조회", description = "동화 게임에서 사용될 정보를 조회합니다.")
    public FairytaleResponseDto getFairytale(@RequestParam Long kidId) {
        return fairytaleService.getFairytale();
    }
}
