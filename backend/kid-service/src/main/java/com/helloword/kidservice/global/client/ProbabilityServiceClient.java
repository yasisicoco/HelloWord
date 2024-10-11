package com.helloword.kidservice.global.client;

import com.helloword.kidservice.domain.kid.dto.request.CreateAnswerWordLogRequestDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "probability-service")
public interface ProbabilityServiceClient {
    @PostMapping("/internal/probability")
    void createAnswerWordLog(@RequestBody CreateAnswerWordLogRequestDto createAnswerWordLogRequestDto);
}