package com.helloword.wordservice.global.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "kid-service")
public interface KidServiceClient {
    @GetMapping("/internal/kids/{kidId}/age")
    Integer getKidAgeById(@RequestParam("kidId") Long kidId);
}

