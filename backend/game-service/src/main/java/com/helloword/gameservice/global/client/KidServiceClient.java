package com.helloword.gameservice.global.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "kid-service")
public interface KidServiceClient {

	@PutMapping("/internal/kids/{kidId}/speed-game-tutorial")
	boolean changeIsSpeedGameTutorialCompleted(@RequestParam Long kidId);

	@PutMapping("/internal/kids/{kidId}/speech-game-tutorial")
	boolean changeIsSpeechGameTutorialCompleted(@RequestParam Long kidId);

	@PutMapping("/internal/kids/{kidId}/pair-game-tutorial")
	boolean changeIsPairGameTutorialCompleted(@RequestParam Long kidId);

	@PutMapping("/internal/kids/{kidId}/fairytale-game-tutorial")
	boolean changeIsFairytaleGameTutorialCompleted(@RequestParam Long kidId);
}
