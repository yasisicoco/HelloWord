package com.helloword.gameservice.domain.game.dto.request;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GameLogRequestDto {

	@NotNull
	private Long kidId;

	@NotNull
	private String gameType;

	@NotNull
	private LocalDate createdAt;

	@NotNull
	private int playTime;

	@NotNull
	private double correctRate;
}

