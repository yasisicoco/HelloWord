package com.helloword.logservice.domain.log.service;

import com.helloword.logservice.domain.log.dto.request.CreateLogRequestDto;
import com.helloword.logservice.domain.log.dto.response.GameStatsResponseDto;
import com.helloword.logservice.domain.log.dto.response.LearningStatsResponseDto;

public interface LogService {
	void createLog(CreateLogRequestDto requestDto);
	LearningStatsResponseDto getLearningStats(Long kidId);
	GameStatsResponseDto getGameStats(Long kidId);
}
