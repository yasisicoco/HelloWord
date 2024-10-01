package com.helloword.gameservice.global.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.helloword.gameservice.domain.game.dto.response.SpeechWordResponseDto;
import com.helloword.gameservice.domain.game.dto.response.SpeedWordResponseDto;

@FeignClient(name = "word-service")
public interface WordServiceClient {

	@GetMapping("/api/words/internal/speed")
	SpeedWordResponseDto getSpeedWords(@RequestParam("kidId") Long kidId);

	@GetMapping("/api/words/internal/speech")
	SpeechWordResponseDto getSpeechWords(@RequestParam("kidId") Long kidId);
}
