package com.helloword.kidservice.domain.kid.controller;

import com.helloword.kidservice.domain.kid.dto.request.KidExpUpdateRequestDto;
import com.helloword.kidservice.domain.kid.service.KidService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/kids")
@RequiredArgsConstructor
@Tag(name = "[내부]아이 API", description = "서버 내부에서 통신하는 아이에 대한 API 입니다.")
public class InternalKidController {

    private final KidService kidService;

    @Operation(summary = "아이 개월 수 조회", description = "해당 아이의 개월 수를 조회합니다.")
    @GetMapping("/{kids}/age")
    public Integer getKidAgeById(@RequestParam Long kidId) {
        return kidService.getKidAgeById(kidId);
    }

    @Operation(summary = "아이 경험치 수정", description = "요청한 정보로 아이의 경험치를 수정합니다.")
    @PutMapping("/exp")
    public void updateKidExp(@RequestBody KidExpUpdateRequestDto kidExpUpdateRequestDto) {
        kidService.increaseExperience(kidExpUpdateRequestDto);
    }

    @Operation(summary = "아이 스피드게임 튜토리얼 여부 수정", description = "해당 아이의 스피드게임 튜토리얼 여부를 수정합니다.")
    @PutMapping("/{kidId}/speed-game-tutorial")
    public boolean changeIsSpeedGameTutorialCompleted(@RequestParam Long kidId) {
        return kidService.changeIsSpeedGameTutorialCompleted(kidId);
    }

    @Operation(summary = "아이 말하기게임 튜토리얼 여부 수정", description = "해당 아이의 말하기게임 튜토리얼 여부를 수정합니다.")
    @PutMapping("/{kidId}/speech-game-tutorial")
    public boolean changeIsSpeechGameTutorialCompleted(@RequestParam Long kidId) {
        return kidService.changeIsSpeechGameTutorialCompleted(kidId);
    }

    @Operation(summary = "아이 짝맞추기게임 튜토리얼 여부 수정", description = "해당 아이의 짝맞추기게임 튜토리얼 여부를 수정합니다.")
    @PutMapping("/{kidId}/pair-game-tutorial")
    public boolean changeIsPairGameTutorialCompleted(@RequestParam Long kidId) {
        return kidService.changeIsPairGameTutorialCompleted(kidId);
    }

    @Operation(summary = "아이 동화게임 튜토리얼 여부 수정", description = "해당 아이의 동화게임 튜토리얼 여부를 수정합니다.")
    @PutMapping("/{kidId}/fairytale-game-tutorial")
    public boolean changeIsFairytaleGameTutorialCompleted(@RequestParam Long kidId) {
        return kidService.changeIsFairytaleGameTutorialCompleted(kidId);
    }

}
