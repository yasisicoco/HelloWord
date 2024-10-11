package com.helloword.gameservice.global.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.helloword.gameservice.domain.game.dto.request.GameLogRequestDto;

@FeignClient(name = "log-service")
public interface LogServiceClient {

	@PostMapping("/internal/logs")
	void saveGameLog(@RequestBody GameLogRequestDto gameLogRequest);
}
