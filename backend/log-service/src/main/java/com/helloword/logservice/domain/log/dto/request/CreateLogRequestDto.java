package com.helloword.logservice.domain.log.dto.request;

import com.helloword.logservice.domain.log.model.GameType;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class CreateLogRequestDto {

	@NotNull
	private Long kidId;

	@NotNull
	private GameType gameType;

	@NotNull
	private Integer playTime;

	@NotNull
	private Double correctRate;

	@NotNull
	private Integer correctCount;

}
