package com.helloword.gameservice.global.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.helloword.gameservice.domain.game.dto.response.FairytaleWordResponseDto;
import com.helloword.gameservice.domain.game.dto.response.GameWordResponseDto;

@FeignClient(name = "word-service")
public interface WordServiceClient {

	@GetMapping("/internal/words/game")
	GameWordResponseDto getGameWords(@RequestParam("kidId") Long kidId, @RequestParam("wordCount") Integer wordCount);

	@GetMapping("/internal/words/fairytale")
	FairytaleWordResponseDto getFairytaleWords(@RequestParam("kidId") Long kidId);
}
