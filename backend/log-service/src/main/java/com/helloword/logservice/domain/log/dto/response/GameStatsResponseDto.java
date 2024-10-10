package com.helloword.logservice.domain.log.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GameStatsResponseDto {

	private Double speedGameKidAverageCorrectRate;
	private Double speedGameGlobalAverageCorrectRate;
	private Integer speedGameKidAveragePlayTime;
	private Integer speedGameGlobalAveragePlayTime;
	private Double speechGameKidAverageCorrectRate;
	private Double speechGameGlobalAverageCorrectRate;
	private Integer speechGameKidAveragePlayTime;
	private Integer speechGameGlobalAveragePlayTime;
	private Double pairGameKidAverageCorrectRate;
	private Double pairGameGlobalAverageCorrectRate;
	private Integer pairGameKidAveragePlayTime;
	private Integer pairGameGlobalAveragePlayTime;
	private Double fairytaleGameKidAverageCorrectRate;
	private Double fairytaleGameGlobalAverageCorrectRate;
	private Integer fairytaleGameKidAveragePlayTime;
	private Integer fairytaleGameGlobalAveragePlayTime;
}

