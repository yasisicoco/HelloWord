package com.helloword.wordservice.domain.word.controller;

import com.helloword.wordservice.domain.word.model.Word;
import com.helloword.wordservice.domain.word.service.WordService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/internal/words")
@RequiredArgsConstructor
@Tag(name = "[내부]단어 API", description = "서버 내부에서 통신하는 단어에 대한 API 입니다.")
public class InternalWordController {
    private final WordService wordService;

    @GetMapping
    @Operation(summary = "모든 단어 조회", description = "모든 단어를 조회합니다.")
    public List<Word> getAllWords() {
        return wordService.getAllWords();
    }
}
