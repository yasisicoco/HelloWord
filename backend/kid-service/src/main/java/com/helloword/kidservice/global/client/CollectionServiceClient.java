package com.helloword.kidservice.global.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.helloword.kidservice.domain.kid.dto.request.CreateCollectionRequestDto;

@FeignClient(name = "collection-service")
public interface CollectionServiceClient {

	@PostMapping("/internal/collections")
	void createCollections(@RequestBody CreateCollectionRequestDto requestDto);
}
