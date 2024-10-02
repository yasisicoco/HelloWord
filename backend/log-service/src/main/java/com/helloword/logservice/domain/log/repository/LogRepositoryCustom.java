package com.helloword.logservice.domain.log.repository;

import java.util.Map;

import com.helloword.logservice.domain.log.model.GameType;

public interface LogRepositoryCustom {
	Integer findTodayTotalPlayTime(Long kidId);
	Integer findTodayCompletedGameCount(Long kidId);
	Map<Integer, Integer> findWeeklyCorrectWordCount(Long kidId);
	Map<Integer, Integer> findMonthlyCorrectWordCount(Long kidId);
	Double findKidAverageCorrectRateByGameType(Long kidId, GameType gameType);
	Double findGlobalAverageCorrectRateByGameType(GameType gameType);
}
