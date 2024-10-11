package com.helloword.collectionservice.domain.collection.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
@Tag(name = "[내부]도감 API", description = "서버 내부에서 통신하는 도감에 대한 API 입니다.")
public class InternalCollectionController {

	private final CollectionService collectionService;

    @Operation(summary = "도감 생성", description = "해당 아이의 도감을 생성합니다.")
	@PostMapping
	public void createCollections(@RequestBody CreateCollectionRequestDto requestDto) {
		collectionService.createCollections(requestDto);

		log.info("collection service - request: {}", requestDto);
		log.info("collection service - response: create ok");
	}

    @Operation(summary = "도감 수정", description = "해당 아이의 도감을 수정합니다.")
    @PutMapping
	public void updateCollections(@RequestBody UpdateCollectionRequestDto requestDto) {
		collectionService.updateCollections(requestDto);

		log.info("collection service - request: {}", requestDto);
		log.info("collection service - response: create ok");
	}
}
