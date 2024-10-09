package com.helloword.logservice.domain.log.service;

import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.helloword.logservice.domain.log.dto.request.CreateLogRequestDto;
import com.helloword.logservice.domain.log.dto.response.GameStatsResponseDto;
import com.helloword.logservice.domain.log.dto.response.LearningStatsResponseDto;
import com.helloword.logservice.domain.log.model.GameType;
import com.helloword.logservice.domain.log.model.Log;
import com.helloword.logservice.domain.log.repository.LogRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class LogServiceImpl implements LogService {

	private final LogRepository logRepository;

	@Transactional
	public void createLog(CreateLogRequestDto requestDto) {
		logRepository.save(Log.createLog(requestDto));
	}

	public LearningStatsResponseDto getLearningStats(Long kidId) {
		Integer todayPlayTime = getNonNullAverageByInteger(logRepository.findTodayTotalPlayTime(kidId));
		Integer todayCompletedGames = logRepository.findTodayCompletedGameCount(kidId);
		Map<String, Integer> dailyCorrectWordCounts = logRepository.findDailyCorrectWordCount(kidId);
		Map<String, Double> globalDailyAverageCorrectWordCounts = logRepository.findGlobalDailyAverageCorrectWordCount();

		return new LearningStatsResponseDto(todayPlayTime, todayCompletedGames, dailyCorrectWordCounts, globalDailyAverageCorrectWordCounts);
	}

	@Override
	public GameStatsResponseDto getGameStats(Long kidId) {
		Double speedGameKidAvg = getNonNullAverage(logRepository.findKidAverageCorrectRateByGameType(kidId, GameType.SPEED_GAME));
		Double speedGameGlobalAvg = getNonNullAverage(logRepository.findGlobalAverageCorrectRateByGameType(GameType.SPEED_GAME));
		Double speedGameKidAvgPlayTime = getNonNullAverage(logRepository.findKidAveragePlayTimeByGameType(kidId, GameType.SPEED_GAME));
		Double speedGameGlobalAvgPlayTime = getNonNullAverage(logRepository.findGlobalAveragePlayTimeByGameType(GameType.SPEED_GAME));

		Double speechGameKidAvg = getNonNullAverage(logRepository.findKidAverageCorrectRateByGameType(kidId, GameType.SPEECH_GAME));
		Double speechGameGlobalAvg = getNonNullAverage(logRepository.findGlobalAverageCorrectRateByGameType(GameType.SPEECH_GAME));
		Double speechGameKidAvgPlayTime = getNonNullAverage(logRepository.findKidAveragePlayTimeByGameType(kidId, GameType.SPEECH_GAME));
		Double speechGameGlobalAvgPlayTime = getNonNullAverage(logRepository.findGlobalAveragePlayTimeByGameType(GameType.SPEECH_GAME));

		Double pairGameKidAvg = getNonNullAverage(logRepository.findKidAverageCorrectRateByGameType(kidId, GameType.PAIR_GAME));
		Double pairGameGlobalAvg = getNonNullAverage(logRepository.findGlobalAverageCorrectRateByGameType(GameType.PAIR_GAME));
		Double pairGameKidAvgPlayTime = getNonNullAverage(logRepository.findKidAveragePlayTimeByGameType(kidId, GameType.PAIR_GAME));
		Double pairGameGlobalAvgPlayTime = getNonNullAverage(logRepository.findGlobalAveragePlayTimeByGameType(GameType.PAIR_GAME));

		Double fairytaleGameKidAvg = getNonNullAverage(logRepository.findKidAverageCorrectRateByGameType(kidId, GameType.FAIRYTALE_GAME));
		Double fairytaleGameGlobalAvg = getNonNullAverage(logRepository.findGlobalAverageCorrectRateByGameType(GameType.FAIRYTALE_GAME));
		Double fairytaleGameKidAvgPlayTime = getNonNullAverage(logRepository.findKidAveragePlayTimeByGameType(kidId, GameType.FAIRYTALE_GAME));
		Double fairytaleGameGlobalAvgPlayTime = getNonNullAverage(logRepository.findGlobalAveragePlayTimeByGameType(GameType.FAIRYTALE_GAME));

		return new GameStatsResponseDto(
			speedGameKidAvg, speedGameGlobalAvg, speedGameKidAvgPlayTime, speedGameGlobalAvgPlayTime,
			speechGameKidAvg, speechGameGlobalAvg, speechGameKidAvgPlayTime, speechGameGlobalAvgPlayTime,
			pairGameKidAvg, pairGameGlobalAvg, pairGameKidAvgPlayTime, pairGameGlobalAvgPlayTime,
			fairytaleGameKidAvg, fairytaleGameGlobalAvg, fairytaleGameKidAvgPlayTime, fairytaleGameGlobalAvgPlayTime
		);
	}

	private Double getNonNullAverage(Double value) {
		return (value != null) ? value : 0.0;
	}

	private Integer getNonNullAverageByInteger(Integer value) {
		return (value != null) ? value : 0;
	}

}
