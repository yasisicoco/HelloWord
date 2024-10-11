package com.helloword.gameservice.domain.game.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GameWordResponseDto {

	private List<WordDto> words;

	@Getter
	@NoArgsConstructor
	@AllArgsConstructor
	public static class WordDto {
		private Long wordId;
		private String word;
		private String imageUrl;
		private String voiceUrl;
	}
}
