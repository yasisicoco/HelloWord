package com.helloword.logservice.domain.log.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GameStatsResponseDto {

	private Double speedGameKidAverageCorrectRate;
	private Double speedGameGlobalAverageCorrectRate;
	private Double speedGameKidAveragePlayTime;
	private Double speedGameGlobalAveragePlayTime;
	private Double speechGameKidAverageCorrectRate;
	private Double speechGameGlobalAverageCorrectRate;
	private Double speechGameKidAveragePlayTime;
	private Double speechGameGlobalAveragePlayTime;
	private Double pairGameKidAverageCorrectRate;
	private Double pairGameGlobalAverageCorrectRate;
	private Double pairGameKidAveragePlayTime;
	private Double pairGameGlobalAveragePlayTime;
	private Double fairytaleGameKidAverageCorrectRate;
	private Double fairytaleGameGlobalAverageCorrectRate;
	private Double fairytaleGameKidAveragePlayTime;
	private Double fairytaleGameGlobalAveragePlayTime;
}

