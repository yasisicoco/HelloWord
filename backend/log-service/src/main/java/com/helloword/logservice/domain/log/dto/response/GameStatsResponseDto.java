package com.helloword.logservice.domain.log.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GameStatsResponseDto {

	private Double speedGameKidAverageCorrectRate;
	private Double speedGameGlobalAverageCorrectRate;
	private Double speechGameKidAverageCorrectRate;
	private Double speechGameGlobalAverageCorrectRate;
	private Double pairGameKidAverageCorrectRate;
	private Double pairGameGlobalAverageCorrectRate;
	private Double fairytaleGameKidAverageCorrectRate;
	private Double fairytaleGameGlobalAverageCorrectRate;
}
