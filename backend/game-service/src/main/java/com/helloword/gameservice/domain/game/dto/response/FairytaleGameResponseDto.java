package com.helloword.gameservice.domain.game.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FairytaleGameResponseDto {
	private String storyTitle;
	private int sentenceCount;
	private List<RoundDto> rounds;
	private Boolean needsTutorial;

	@Getter
	@AllArgsConstructor
	public static class RoundDto {
		private String sentence;
		private String imageUrl;
		private int sentenceOrder;
		private WordDto correctWord;
		private List<WordDto> incorrectWords;
	}

	@Getter
	@AllArgsConstructor
	public static class WordDto {
		private Long wordId;
		private String word;
	}
}

