package com.helloword.gameservice.domain.game.service;

import com.helloword.gameservice.domain.game.dto.response.FairytaleGameResponseDto;
import com.helloword.gameservice.domain.game.dto.response.PairGameResponseDto;
import com.helloword.gameservice.domain.game.dto.response.SpeechGameResponseDto;
import com.helloword.gameservice.domain.game.dto.response.SpeedGameResponseDto;

public interface GameService {

	SpeedGameResponseDto getSpeedGameCards(Long kidId);
	SpeechGameResponseDto getSpeechGameCards(Long kidId);
	PairGameResponseDto getPairGameCards(Long kidId);
	FairytaleGameResponseDto getFairytaleGameCards(Long kidId);
}
