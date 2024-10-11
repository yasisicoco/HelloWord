package com.helloword.collectionservice.domain.collection.dto.response;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import com.helloword.collectionservice.domain.collection.model.Collection;
import com.helloword.collectionservice.global.exception.CustomException;
import com.helloword.collectionservice.global.exception.ExceptionResponse;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class CollectionsResponseDto {

	private List<CollectionData> collections;
	private int collectionRate;
	private int allCount;
	private long completedCount;
	private long uncompletedCount;

	public static CollectionsResponseDto createCollectionsResponseDto(List<Collection> collections, List<WordsResponseDto.WordData> words) {
		List<CollectionData> collectionDataList = collections.stream()
			.map(collection -> {
				WordsResponseDto.WordData word = words.stream()
					.filter(w -> w.getWordId().equals(collection.getWordId()))
					.findFirst()
					.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND));

				return new CollectionData(
					collection.getWordId(),
					word.getWord(),
					word.getImageUrl(),
					word.getVoiceUrl(),
					collection.getCount(),
					collection.getIsCompleted(),
					collection.getCompletionDate()
				);
			}).collect(Collectors.toList());

		long completedCount = collections.stream().filter(Collection::getIsCompleted).count();
		double collectionRate = ((double) completedCount / collections.size()) * 100;
		int roundedCollectionRate = (int) Math.round(collectionRate);

		return new CollectionsResponseDto(collectionDataList, roundedCollectionRate, collections.size(),
			completedCount, collections.size() - completedCount);
	}

	@AllArgsConstructor
	@Getter
	public static class CollectionData {
		private Long wordId;
		private String word;
		private String imageUrl;
		private String voiceUrl;
		private int count;
		private Boolean isCompleted;
		private LocalDate completionDate;
	}
}
