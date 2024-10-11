package com.helloword.logservice.domain.log.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.helloword.logservice.domain.log.dto.request.CreateLogRequestDto;
import com.helloword.logservice.domain.log.dto.response.GameStatsResponseDto;
import com.helloword.logservice.domain.log.dto.response.LearningStatsResponseDto;
import com.helloword.logservice.domain.log.service.LogService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/internal/logs")
@Slf4j
@Tag(name = "[내부]기록 API", description = "서버 내부에서 통신하는 기록에 대한 API 입니다.")
public class InternalLogController {

	private final LogService logService;

    @Operation(summary = "기록 생성", description = "기록을 생성합니다.")
	@PostMapping
    public void createLog(@RequestBody CreateLogRequestDto requestDto) {
		logService.createLog(requestDto);

		log.info("log service - request: {}", requestDto);
		log.info("log service - response: create ok");
	}

    @Operation(summary = "학습 정보 조회", description = "학습 데이터를 조회합니다.")
	@GetMapping("/learning-stats")
	public LearningStatsResponseDto getLearningStats(@RequestParam Long kidId) {
		return logService.getLearningStats(kidId);
	}

    @Operation(summary = "게임 정보 조회", description = "게임 데이터를 조회합니다.")
	@GetMapping("/game-stats")
	public GameStatsResponseDto getGameStats(@RequestParam Long kidId) {
		return logService.getGameStats(kidId);
	}
}
