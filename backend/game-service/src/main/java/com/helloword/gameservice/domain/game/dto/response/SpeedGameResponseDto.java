package com.helloword.gameservice.domain.game.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SpeedGameResponseDto {

	private List<RoundDto> rounds;
	private Boolean needsTutorial;

	@Getter
	@AllArgsConstructor
	public static class RoundDto {
		private CorrectWordDto correctWord;
		private List<IncorrectWordDto> incorrectWords;
	}

	@Getter
	@AllArgsConstructor
	public static class CorrectWordDto {
		private Long wordId;
		private String word;
		private String imageUrl;
		private String voiceUrl;
	}

	@Getter
	@AllArgsConstructor
	public static class IncorrectWordDto {
		private Long wordId;
		private String word;
	}
}
