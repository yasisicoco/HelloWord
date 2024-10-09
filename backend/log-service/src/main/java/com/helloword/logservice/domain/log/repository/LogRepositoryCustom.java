package com.helloword.logservice.domain.log.repository;

import java.util.Map;

import com.helloword.logservice.domain.log.model.GameType;

public interface LogRepositoryCustom {
	Integer findTodayTotalPlayTime(Long kidId);
	Integer findTodayCompletedGameCount(Long kidId);
	Map<String, Integer> findDailyCorrectWordCount(Long kidId);
	Double findKidAverageCorrectRateByGameType(Long kidId, GameType gameType);
	Double findGlobalAverageCorrectRateByGameType(GameType gameType);
	Double findKidAveragePlayTimeByGameType(Long kidId, GameType gameType);
	Double findGlobalAveragePlayTimeByGameType(GameType gameType);
}
