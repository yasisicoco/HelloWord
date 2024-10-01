package com.helloword.gameservice.domain.game.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class SpeedWordResponseDto {

	private List<WordDto> correctWords;
	private List<WordDto> incorrectWords;

	@AllArgsConstructor
	@Getter
	public static class WordDto {
		private Long wordId;
		private String word;
		private String imageUrl;
		private String voiceUrl;
	}
}
