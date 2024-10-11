package com.helloword.wordservice.global.client;

import com.helloword.wordservice.domain.word.dto.response.AnswerWordLogsResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "probability-service")
public interface ProbabilityServiceClient {
    @GetMapping("/internal/probability")
    AnswerWordLogsResponseDto getAnswerWordLogs(@RequestParam("kidId") Long kidId);
}

