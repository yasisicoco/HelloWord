package com.helloword.collectionservice.domain.collection.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "도감 API", description = "도감 API에 대한 설명입니다.")
public class CollectionController {

	private final CollectionService collectionService;

    @Operation(summary = "도감 조회", description = "해당 아이의 도감을 조회합니다.")
    @GetMapping
	public CollectionsResponseDto getAnswerWordLogs(@RequestParam("kidId") Long kidId) {
		CollectionsResponseDto responseDto = collectionService.getCollectionsByKidId(kidId);

		log.info("collection service - request: kidId {}", kidId);
		log.info("collection service - response: {}", responseDto);
		return responseDto;
	}
}
