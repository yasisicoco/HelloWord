package com.helloword.logservice.domain.log.dto.response;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LearningStatsResponseDto {

	private Integer todayPlayTime;
	private Integer todayCompletedGames;
	private Map<String, Integer> dailyCorrectWordCounts;
}

