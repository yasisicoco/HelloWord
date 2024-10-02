package com.helloword.gameservice.global.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.helloword.gameservice.domain.game.dto.request.UpdateCollectionRequestDto;

@FeignClient(name = "collection-service")
public interface CollectionServiceClient {

	@PatchMapping("/internal/collections")
	void updateCollections(@RequestBody UpdateCollectionRequestDto requestDto);
}
