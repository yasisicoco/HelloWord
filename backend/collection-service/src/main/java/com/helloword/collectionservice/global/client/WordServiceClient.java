package com.helloword.collectionservice.global.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.helloword.collectionservice.domain.collection.dto.response.WordsResponseDto;

@FeignClient(name = "word-service")
public interface WordServiceClient {

	@GetMapping("/api/words/kids")
	WordsResponseDto getWordsByKidId(@RequestParam("kidId") Long kidId);
}
