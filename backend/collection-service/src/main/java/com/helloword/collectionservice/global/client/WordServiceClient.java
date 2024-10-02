package com.helloword.collectionservice.global.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import com.helloword.collectionservice.domain.collection.dto.response.WordsResponseDto;

@FeignClient(name = "word-service")
public interface WordServiceClient {

	@GetMapping("/internal/words")
	WordsResponseDto getWords();
}
