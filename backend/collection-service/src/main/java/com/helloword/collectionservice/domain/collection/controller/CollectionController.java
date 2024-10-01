package com.helloword.collectionservice.domain.collection.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.helloword.collectionservice.domain.collection.dto.response.CollectionsResponseDto;
import com.helloword.collectionservice.domain.collection.service.CollectionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/collections")
@Slf4j
public class CollectionController {

	private final CollectionService collectionService;

	@GetMapping
	public CollectionsResponseDto getAnswerWordLogs(@RequestParam("kidId") Long kidId) {
		CollectionsResponseDto responseDto = collectionService.getCollectionsByKidId(kidId);

		log.info("collection service - request: kidId {}", kidId);
		log.info("collection service - response: {}", responseDto);
		return responseDto;
	}
}