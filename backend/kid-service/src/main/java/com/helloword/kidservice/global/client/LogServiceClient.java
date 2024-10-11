package com.helloword.kidservice.global.client;

import com.helloword.kidservice.domain.kid.dto.response.GameStatsResponseDto;
import com.helloword.kidservice.domain.kid.dto.response.LearningStatsResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "log-service")
public interface LogServiceClient {

    @GetMapping("/internal/logs/learning-stats")
    LearningStatsResponseDto getLearningStats(@RequestParam Long kidId);

    @GetMapping("/internal/logs/game-stats")
    GameStatsResponseDto getGameStats(@RequestParam Long kidId);
}
