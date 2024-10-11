package com.helloword.logservice.domain.log.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GameStatsResponseDto {

	private Integer speedGameKidAverageCorrectRate;
	private Integer speedGameGlobalAverageCorrectRate;
	private Integer speedGameKidAveragePlayTime;
	private Integer speedGameGlobalAveragePlayTime;
	private Integer speechGameKidAverageCorrectRate;
	private Integer speechGameGlobalAverageCorrectRate;
	private Integer speechGameKidAveragePlayTime;
	private Integer speechGameGlobalAveragePlayTime;
	private Integer pairGameKidAverageCorrectRate;
	private Integer pairGameGlobalAverageCorrectRate;
	private Integer pairGameKidAveragePlayTime;
	private Integer pairGameGlobalAveragePlayTime;
	private Integer fairytaleGameKidAverageCorrectRate;
	private Integer fairytaleGameGlobalAverageCorrectRate;
	private Integer fairytaleGameKidAveragePlayTime;
	private Integer fairytaleGameGlobalAveragePlayTime;
}

