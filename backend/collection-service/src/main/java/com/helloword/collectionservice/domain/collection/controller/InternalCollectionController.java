package com.helloword.collectionservice.domain.collection.controller;

import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.helloword.collectionservice.domain.collection.dto.request.CreateCollectionRequestDto;
import com.helloword.collectionservice.domain.collection.dto.request.UpdateCollectionRequestDto;
import com.helloword.collectionservice.domain.collection.service.CollectionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/internal/collections")
@Slf4j
public class InternalCollectionController {

	private final CollectionService collectionService;

	@PostMapping
	public void createCollections(@RequestBody CreateCollectionRequestDto requestDto) {
		collectionService.createCollections(requestDto);

		log.info("collection service - request: {}", requestDto);
		log.info("collection service - response: create ok");
	}

	@PatchMapping
	public void updateCollections(@RequestBody UpdateCollectionRequestDto requestDto) {
		collectionService.updateCollections(requestDto);

		log.info("collection service - request: {}", requestDto);
		log.info("collection service - response: create ok");
	}
}
