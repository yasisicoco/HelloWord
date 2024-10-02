package com.helloword.gameservice.domain.game.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GameResultRequestDto {

	@NotNull
	private Long kidId;

	@NotNull
	private List<AnswerWordDto> answerWords;

	@NotNull
	private String gameType;

	@NotNull
	private int playTime;

	@NotNull
	private double correctRate;

	@Getter
	@AllArgsConstructor
	public static class AnswerWordDto {

		@NotNull
		private Long id;

		@NotNull
		private String word;
	}
}

