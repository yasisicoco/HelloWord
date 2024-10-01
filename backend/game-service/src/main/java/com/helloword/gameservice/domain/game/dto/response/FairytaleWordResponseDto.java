package com.helloword.gameservice.domain.game.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FairytaleWordResponseDto {
	private String storyTitle;
	private int sentenceCount;
	private List<SentenceDto> sentences;
	private List<WordDto> incorrectWords;

	@Getter
	@AllArgsConstructor
	public static class SentenceDto {
		private String sentence;
		private String imageUrl;
		private int sentenceOrder;
		private WordDto correctWord;
	}

	@Getter
	@AllArgsConstructor
	public static class WordDto {
		private Long wordId;
		private String word;
	}

}

