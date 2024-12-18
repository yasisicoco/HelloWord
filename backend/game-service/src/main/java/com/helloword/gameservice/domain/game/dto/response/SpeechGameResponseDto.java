package com.helloword.gameservice.domain.game.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SpeechGameResponseDto {

	private List<RoundDto> rounds;
	private Boolean needsTutorial;

	@Getter
	@AllArgsConstructor
	public static class RoundDto {
		private Long wordId;
		private String word;
		private String imageUrl;
	}
}
