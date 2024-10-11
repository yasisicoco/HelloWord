package com.helloword.gameservice.domain.game.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.helloword.gameservice.domain.game.dto.request.GameResultRequestDto;
import com.helloword.gameservice.domain.game.dto.response.FairytaleGameResponseDto;
import com.helloword.gameservice.domain.game.dto.response.PairGameResponseDto;
import com.helloword.gameservice.domain.game.dto.response.SpeechGameResponseDto;
import com.helloword.gameservice.domain.game.dto.response.SpeedGameResponseDto;
import com.helloword.gameservice.domain.game.service.GameService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/games")
@Slf4j
@Tag(name = "게임 API", description = "게임 API에 대한 설명입니다.")
public class GameController {

	private final GameService gameService;

    @Operation(summary = "스피드 게임 단어 조회", description = "해당 아이의 스피드 게임 단어를 반환합니다.")
    @GetMapping("/speed-cards")
	public SpeedGameResponseDto getSpeedGameCards(@RequestParam("kidId") Long kidId) {
		return gameService.getSpeedGameCards(kidId);
	}

    @Operation(summary = "말하기 게임 단어 조회", description = "해당 아이의 말하기 게임 단어를 반환합니다.")
	@GetMapping("/speech-cards")
	public SpeechGameResponseDto getSpeechGameCards(@RequestParam("kidId") Long kidId) {
		return gameService.getSpeechGameCards(kidId);
	}

    @Operation(summary = "짝맞추기 게임 단어 조회", description = "해당 아이의 짝맞추기 게임 단어를 반환합니다.")
	@GetMapping("/pair-cards")
	public PairGameResponseDto getPairGameCards(@RequestParam("kidId") Long kidId) {
		return gameService.getPairGameCards(kidId);
	}

    @Operation(summary = "동화 게임 조회", description = "해당 아이의 동화 게임에 사용될 정보를 반환합니다.")
	@GetMapping("/fairytale-cards")
	public FairytaleGameResponseDto getFairytaleGameCards(@RequestParam("kidId") Long kidId) {
		return gameService.getFairytaleGameCards(kidId);
	}

    @Operation(summary = "게임 결과 저장", description = "게임의 결과를 저장합니다.")
	@PostMapping("/results")
	public void saveGameResult(@RequestBody GameResultRequestDto requestDto) {
		gameService.saveGameResult(requestDto);
	}
}
