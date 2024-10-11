package com.helloword.gameservice.domain.game.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class UpdateCollectionRequestDto {

	@NotNull
	private List<CollectionUpdateDto> collections;

	@NotNull
	private Long kidId;


	@Getter
	@NoArgsConstructor(access = AccessLevel.PROTECTED)
	@AllArgsConstructor
	public static class CollectionUpdateDto {

		@NotNull
		private Long wordId;

		@NotNull
		private Integer count;
	}
}
