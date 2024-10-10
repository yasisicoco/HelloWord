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

	@Override
	public LearningStatsResponseDto getLearningStats(Long kidId) {
		Integer todayPlayTime = getNonNullAverage(logRepository.findTodayTotalPlayTime(kidId));
		Integer todayCompletedGames = logRepository.findTodayCompletedGameCount(kidId);
		Map<String, Integer> dailyCorrectWordCounts = logRepository.findDailyCorrectWordCount(kidId);
		Map<String, Integer> globalDailyAverageCorrectWordCounts = logRepository.findGlobalDailyAverageCorrectWordCount();

		return new LearningStatsResponseDto(todayPlayTime, todayCompletedGames, dailyCorrectWordCounts, globalDailyAverageCorrectWordCounts);
	}

	@Override
	public GameStatsResponseDto getGameStats(Long kidId) {
		Double speedGameKidAvg = getNonNullAverageByDouble(logRepository.findKidAverageCorrectRateByGameType(kidId, GameType.SPEED_GAME)) * 100.0;
		Double speedGameGlobalAvg = getNonNullAverageByDouble(logRepository.findGlobalAverageCorrectRateByGameType(GameType.SPEED_GAME)) * 100.0;
		Integer speedGameKidAvgPlayTime = getNonNullAverage(logRepository.findKidAveragePlayTimeByGameType(kidId, GameType.SPEED_GAME));
		Integer speedGameGlobalAvgPlayTime = getNonNullAverage(logRepository.findGlobalAveragePlayTimeByGameType(GameType.SPEED_GAME));

		Double speechGameKidAvg = getNonNullAverageByDouble(logRepository.findKidAverageCorrectRateByGameType(kidId, GameType.SPEECH_GAME)) * 100.0;
		Double speechGameGlobalAvg = getNonNullAverageByDouble(logRepository.findGlobalAverageCorrectRateByGameType(GameType.SPEECH_GAME)) * 100.0;
		Integer speechGameKidAvgPlayTime = getNonNullAverage(logRepository.findKidAveragePlayTimeByGameType(kidId, GameType.SPEECH_GAME));
		Integer speechGameGlobalAvgPlayTime = getNonNullAverage(logRepository.findGlobalAveragePlayTimeByGameType(GameType.SPEECH_GAME));

		Double pairGameKidAvg = getNonNullAverageByDouble(logRepository.findKidAverageCorrectRateByGameType(kidId, GameType.PAIR_GAME)) * 100.0;
		Double pairGameGlobalAvg = getNonNullAverageByDouble(logRepository.findGlobalAverageCorrectRateByGameType(GameType.PAIR_GAME)) * 100.0;
		Integer pairGameKidAvgPlayTime = getNonNullAverage(logRepository.findKidAveragePlayTimeByGameType(kidId, GameType.PAIR_GAME));
		Integer pairGameGlobalAvgPlayTime = getNonNullAverage(logRepository.findGlobalAveragePlayTimeByGameType(GameType.PAIR_GAME));

		Double fairytaleGameKidAvg = getNonNullAverageByDouble(logRepository.findKidAverageCorrectRateByGameType(kidId, GameType.FAIRYTALE_GAME)) * 100.0;
		Double fairytaleGameGlobalAvg = getNonNullAverageByDouble(logRepository.findGlobalAverageCorrectRateByGameType(GameType.FAIRYTALE_GAME)) * 100.0;
		Integer fairytaleGameKidAvgPlayTime = getNonNullAverage(logRepository.findKidAveragePlayTimeByGameType(kidId, GameType.FAIRYTALE_GAME));
		Integer fairytaleGameGlobalAvgPlayTime = getNonNullAverage(logRepository.findGlobalAveragePlayTimeByGameType(GameType.FAIRYTALE_GAME));

		return new GameStatsResponseDto(
			speedGameKidAvg, speedGameGlobalAvg, speedGameKidAvgPlayTime, speedGameGlobalAvgPlayTime,
			speechGameKidAvg, speechGameGlobalAvg, speechGameKidAvgPlayTime, speechGameGlobalAvgPlayTime,
			pairGameKidAvg, pairGameGlobalAvg, pairGameKidAvgPlayTime, pairGameGlobalAvgPlayTime,
			fairytaleGameKidAvg, fairytaleGameGlobalAvg, fairytaleGameKidAvgPlayTime, fairytaleGameGlobalAvgPlayTime
		);
	}

	private Double getNonNullAverageByDouble(Double value) {
		return (value != null) ? value : 0.0;
	}

	private Integer getNonNullAverage(Integer value) {
		return (value != null) ? value : 0;
	}

}
