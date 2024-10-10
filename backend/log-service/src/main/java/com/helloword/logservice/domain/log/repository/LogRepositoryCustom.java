package com.helloword.logservice.domain.log.repository;

import java.util.Map;

import com.helloword.logservice.domain.log.model.GameType;

public interface LogRepositoryCustom {
	Integer findTodayTotalPlayTime(Long kidId);
	Integer findTodayCompletedGameCount(Long kidId);
	Map<String, Integer> findDailyCorrectWordCount(Long kidId);
	Map<String, Integer> findGlobalDailyAverageCorrectWordCount();
	Double findKidAverageCorrectRateByGameType(Long kidId, GameType gameType);
	Double findGlobalAverageCorrectRateByGameType(GameType gameType);
	Integer findKidAveragePlayTimeByGameType(Long kidId, GameType gameType);
	Integer findGlobalAveragePlayTimeByGameType(GameType gameType);
}
