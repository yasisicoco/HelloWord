package com.helloword.wordservice.domain.word.controller;

import com.helloword.wordservice.domain.word.model.Word;
import com.helloword.wordservice.domain.word.service.WordService;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Hidden
@RestController
@RequestMapping("/internal/words")
@RequiredArgsConstructor
public class InternalWordController {
    private final WordService wordService;

    @GetMapping
    public List<Word> getAllWords() {
        return wordService.getAllWords();
    }
}
