package com.helloword.kidservice.domain.kid.dto.response;

import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LearningStatsResponseDto {
    private Integer todayPlayTime;
    private Integer todayCompletedGames;
    private Map<Integer, Integer> weeklyCorrectWordCounts;
    private Map<Integer, Integer> monthlyCorrectWordCounts;
}

