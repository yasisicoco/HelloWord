package com.helloword.gameservice.domain.game.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.helloword.gameservice.domain.game.dto.response.SpeechGameResponseDto;
import com.helloword.gameservice.domain.game.dto.response.SpeedGameResponseDto;
import com.helloword.gameservice.domain.game.service.GameService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/games")
@Slf4j
public class GameController {

	private final GameService gameService;

	@GetMapping("/speed-cards")
	public SpeedGameResponseDto getSpeedGameCards(@RequestParam("kidId") Long kidId) {
		return gameService.getSpeedGameCards(kidId);
	}

	@GetMapping("/speech-cards")
	public SpeechGameResponseDto getSpeechGameCards(@RequestParam("kidId") Long kidId) {
		return gameService.getSpeechGameCards(kidId);
	}
}
