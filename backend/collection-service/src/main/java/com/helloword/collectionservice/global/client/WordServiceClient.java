package com.helloword.collectionservice.global.client;

import com.helloword.collectionservice.domain.collection.dto.response.WordsResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "word-service")
public interface WordServiceClient {

	@GetMapping("/internal/words/all")
	WordsResponseDto getWords();
}
