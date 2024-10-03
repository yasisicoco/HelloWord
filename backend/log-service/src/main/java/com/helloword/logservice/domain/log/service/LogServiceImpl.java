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
		Integer todayPlayTime = logRepository.findTodayTotalPlayTime(kidId);
		Integer todayCompletedGames = logRepository.findTodayCompletedGameCount(kidId);
		Map<Integer, Integer> weeklyCorrectWordCounts = logRepository.findWeeklyCorrectWordCount(kidId);
		Map<Integer, Integer> monthlyCorrectWordCounts = logRepository.findMonthlyCorrectWordCount(kidId);

		return new LearningStatsResponseDto(todayPlayTime, todayCompletedGames, weeklyCorrectWordCounts, monthlyCorrectWordCounts);
	}

	@Override
	public GameStatsResponseDto getGameStats(Long kidId) {
		Double speedGameKidAvg = getNonNullAverage(logRepository.findKidAverageCorrectRateByGameType(kidId, GameType.SPEED_GAME));
		Double speedGameGlobalAvg = getNonNullAverage(logRepository.findGlobalAverageCorrectRateByGameType(GameType.SPEED_GAME));

		Double speechGameKidAvg = getNonNullAverage(logRepository.findKidAverageCorrectRateByGameType(kidId, GameType.SPEECH_GAME));
		Double speechGameGlobalAvg = getNonNullAverage(logRepository.findGlobalAverageCorrectRateByGameType(GameType.SPEECH_GAME));

		Double pairGameKidAvg = getNonNullAverage(logRepository.findKidAverageCorrectRateByGameType(kidId, GameType.PAIR_GAME));
		Double pairGameGlobalAvg = getNonNullAverage(logRepository.findGlobalAverageCorrectRateByGameType(GameType.PAIR_GAME));

		Double fairytaleGameKidAvg = getNonNullAverage(logRepository.findKidAverageCorrectRateByGameType(kidId, GameType.FAIRYTALE_GAME));
		Double fairytaleGameGlobalAvg = getNonNullAverage(logRepository.findGlobalAverageCorrectRateByGameType(GameType.FAIRYTALE_GAME));

		return new GameStatsResponseDto(
			speedGameKidAvg, speedGameGlobalAvg,
			speechGameKidAvg, speechGameGlobalAvg,
			pairGameKidAvg, pairGameGlobalAvg,
			fairytaleGameKidAvg, fairytaleGameGlobalAvg
		);
	}

	private Double getNonNullAverage(Double value) {
		return (value != null) ? value : 0.0;
	}

}
