package com.helloword.logservice.domain.log.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.helloword.logservice.domain.log.dto.request.CreateLogRequestDto;
import com.helloword.logservice.domain.log.dto.response.GameStatsResponseDto;
import com.helloword.logservice.domain.log.dto.response.LearningStatsResponseDto;
import com.helloword.logservice.domain.log.model.GameType;
import com.helloword.logservice.domain.log.service.LogService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/internal/logs")
@Slf4j
public class InternalLogController {

	private final LogService logService;

	@PostMapping
	public void createLog(@RequestBody CreateLogRequestDto requestDto) {
		logService.createLog(requestDto);

		log.info("log service - request: {}", requestDto);
		log.info("log service - response: create ok");
	}

	@GetMapping("/learning-stats")
	public LearningStatsResponseDto getLearningStats(@RequestParam Long kidId) {
		return logService.getLearningStats(kidId);
	}

	@GetMapping("/game-stats")
	public GameStatsResponseDto getGameStats(@RequestParam Long kidId) {
		return logService.getGameStats(kidId);
	}
}
