package com.helloword.collectionservice.domain.collection.dto.response;

import java.util.List;

import com.helloword.collectionservice.domain.collection.model.Collection;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class CollectionsResponseDto {

	List<Collection> collections;

	public static CollectionsResponseDto createCollectionsResponseDto(List<Collection> collections) {
		return new CollectionsResponseDto(collections);
	}
}
