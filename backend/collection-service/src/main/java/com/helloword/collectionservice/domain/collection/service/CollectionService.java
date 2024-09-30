package com.helloword.collectionservice.domain.collection.service;

import com.helloword.collectionservice.domain.collection.dto.request.CreateCollectionRequestDto;
import com.helloword.collectionservice.domain.collection.dto.request.UpdateCollectionRequestDto;
import com.helloword.collectionservice.domain.collection.dto.response.CollectionsResponseDto;

public interface CollectionService {
	CollectionsResponseDto getCollectionsByKidId(Long kidId);
	void createCollections(CreateCollectionRequestDto requestDto);
	void updateCollections(UpdateCollectionRequestDto requestDto);
}
