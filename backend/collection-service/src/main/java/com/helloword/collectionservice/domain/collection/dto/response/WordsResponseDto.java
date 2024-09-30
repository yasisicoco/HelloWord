package com.helloword.collectionservice.domain.collection.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class WordsResponseDto {

	private List<WordData> words;

	@AllArgsConstructor
	@Getter
	public static class WordData {
		private Long wordId;
		private String word;
		private String imageUrl;
		private String voiceUrl;
	}
}
