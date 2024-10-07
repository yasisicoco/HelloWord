package com.helloword.collectionservice.domain.collection.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
public class WordsResponseDto {

	private List<WordData> words;

	@Data
    public static class WordData {
		private Long wordId;
		private String word;
		private String imageUrl;
		private String voiceUrl;
	}
}
