package com.helloword.collectionservice.domain.collection.service;

import static com.helloword.collectionservice.domain.collection.dto.request.UpdateCollectionRequestDto.*;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.helloword.collectionservice.domain.collection.dto.request.CreateCollectionRequestDto;
import com.helloword.collectionservice.domain.collection.dto.request.KidExpUpdateRequestDto;
import com.helloword.collectionservice.domain.collection.dto.request.UpdateCollectionRequestDto;
import com.helloword.collectionservice.domain.collection.dto.response.CollectionsResponseDto;
import com.helloword.collectionservice.domain.collection.dto.response.WordsResponseDto;
import com.helloword.collectionservice.domain.collection.model.Collection;
import com.helloword.collectionservice.domain.collection.repository.CollectionRepository;
import com.helloword.collectionservice.global.client.KidServiceClient;
import com.helloword.collectionservice.global.client.WordServiceClient;
import com.helloword.collectionservice.global.exception.CustomException;
import com.helloword.collectionservice.global.exception.ExceptionResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class CollectionServiceImpl implements CollectionService {

	private final CollectionRepository collectionRepository;
	private final WordServiceClient wordServiceClient;
	private final KidServiceClient kidServiceClient;

	public CollectionsResponseDto getCollectionsByKidId(Long kidId) {
		List<Collection> collections = collectionRepository.findByKidId(kidId);

		WordsResponseDto wordsResponse = wordServiceClient.getWords();
		List<WordsResponseDto.WordData> words = wordsResponse.getWords();

		return CollectionsResponseDto.createCollectionsResponseDto(collections, words);
	}

	@Transactional
	public void createCollections(CreateCollectionRequestDto requestDto) {
		// TODO: word-service에서 word count를 받아서 200 대신 사용
		List<Collection> answerWordLogs = new ArrayList<>();

		for (long wordId = 1; wordId <= 200; wordId++) {
			Collection collection = Collection.createCollection(requestDto, wordId);
			answerWordLogs.add(collection);
		}

		collectionRepository.saveAll(answerWordLogs);
	}

	@Transactional
	public void updateCollections(UpdateCollectionRequestDto requestDto) {

		int exp = 0;
		long kidId = 0;

		for (CollectionUpdateDto updateDto : requestDto.getCollections()) {
			Collection collection = collectionRepository.findByKidIdAndWordId(updateDto.getKidId(), updateDto.getWordId())
				.orElseThrow(() -> new ExceptionResponse(CustomException.NOT_FOUND));

			if (collection.updateCount(updateDto.getCount())) {
				exp += 10;
			}

			if (kidId == 0) {
				kidId = collection.getKidId();
			}
		}

		if (exp > 0) {
			KidExpUpdateRequestDto expUpdateRequestDto = new KidExpUpdateRequestDto(kidId, exp);
			kidServiceClient.updateKidExp(expUpdateRequestDto);
		}
	}
}
