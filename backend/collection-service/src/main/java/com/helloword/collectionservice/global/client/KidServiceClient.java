package com.helloword.collectionservice.global.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.helloword.collectionservice.domain.collection.dto.request.KidExpUpdateRequestDto;

@FeignClient(name = "kid-service")
public interface KidServiceClient {

	@PatchMapping("/internal/kids/exp")
	void updateKidExp(@RequestBody KidExpUpdateRequestDto requestDto);
}
