package com.helloword.wordservice.domain.word.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GameWordResponseDto {

	private List<WordDto> words;

	@Getter
	@AllArgsConstructor
	public static class WordDto {
		private Long wordId;
		private String word;
		private String imageUrl;
		private String voiceUrl;
	}
}