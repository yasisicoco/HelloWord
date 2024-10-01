package com.helloword.gameservice.domain.game.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.helloword.gameservice.domain.game.dto.response.PairGameResponseDto;
import com.helloword.gameservice.domain.game.dto.response.PairWordResponseDto;
import com.helloword.gameservice.domain.game.dto.response.SpeechGameResponseDto;
import com.helloword.gameservice.domain.game.dto.response.SpeechWordResponseDto;
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

		return new SpeedGameResponseDto(rounds);
	}

	public SpeechGameResponseDto getSpeechGameCards(Long kidId) {
		SpeechWordResponseDto speechWordResponse = wordServiceClient.getSpeechWords(kidId);

		List<SpeechGameResponseDto.RoundDto> rounds = speechWordResponse.getWords().stream()
			.map(word -> new SpeechGameResponseDto.RoundDto(
				word.getWordId(),
				word.getWord(),
				word.getImageUrl()
			))
			.collect(Collectors.toList());

		return new SpeechGameResponseDto(rounds);
	}

	public PairGameResponseDto getPairGameCards(Long kidId) {
		PairWordResponseDto pairWordResponse = wordServiceClient.getPairWords(kidId);

		List<PairGameResponseDto.RoundDto> rounds = new ArrayList<>();
		List<PairWordResponseDto.WordDto> words = pairWordResponse.getWords();

		for (int i = 0; i < words.size(); i += 4) {
			List<PairGameResponseDto.WordDto> wordDtos = words.subList(i, i + 4).stream()
				.map(word -> new PairGameResponseDto.WordDto(
					word.getWordId(),
					word.getWord(),
					word.getImageUrl()
				))
				.collect(Collectors.toList());

			rounds.add(new PairGameResponseDto.RoundDto(wordDtos));
		}

		return new PairGameResponseDto(rounds);
	}
}
