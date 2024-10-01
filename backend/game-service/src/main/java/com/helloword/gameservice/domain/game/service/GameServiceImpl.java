package com.helloword.gameservice.domain.game.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.helloword.gameservice.domain.game.dto.response.SpeedGameResponseDto;
import com.helloword.gameservice.domain.game.dto.response.SpeedWordResponseDto;
import com.helloword.gameservice.global.client.WordServiceClient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameServiceImpl implements GameService {

	private final WordServiceClient wordServiceClient;

	public SpeedGameResponseDto getSpeedGameCards(Long kidId) {
		SpeedWordResponseDto speedWordResponse = wordServiceClient.getSpeedWords(kidId);

		List<SpeedWordResponseDto.WordDto> correctWords = speedWordResponse.getCorrectWords();
		List<SpeedWordResponseDto.WordDto> incorrectWords = speedWordResponse.getIncorrectWords();

		List<SpeedGameResponseDto.RoundDto> rounds = new ArrayList<>();
		for (int i = 0; i < correctWords.size(); i++) {
			SpeedWordResponseDto.WordDto correctWord = correctWords.get(i);
			SpeedGameResponseDto.CorrectWordDto correctWordDto = new SpeedGameResponseDto.CorrectWordDto(
				correctWord.getWordId(),
				correctWord.getWord(),
				correctWord.getImageUrl(),
				correctWord.getVoiceUrl());

			List<SpeedGameResponseDto.IncorrectWordDto> incorrectWordDtos = incorrectWords.subList(i * 3, (i + 1) * 3).stream()
				.map(incorrectWord -> new SpeedGameResponseDto.IncorrectWordDto(
					incorrectWord.getWordId(),
					incorrectWord.getWord()
				))
				.collect(Collectors.toList());

			SpeedGameResponseDto.RoundDto roundDto = new SpeedGameResponseDto.RoundDto(correctWordDto, incorrectWordDtos);
			rounds.add(roundDto);
		}

		// 최종 응답 생성
		return new SpeedGameResponseDto(rounds);
	}
}
