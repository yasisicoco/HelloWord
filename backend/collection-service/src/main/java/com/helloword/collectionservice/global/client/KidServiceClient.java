package com.helloword.collectionservice.global.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.helloword.collectionservice.domain.collection.dto.request.KidExpUpdateRequestDto;

@FeignClient(name = "kid-service")
public interface KidServiceClient {

	@PutMapping("/internal/kids/exp")
	void updateKidExp(@RequestBody KidExpUpdateRequestDto requestDto);
}
