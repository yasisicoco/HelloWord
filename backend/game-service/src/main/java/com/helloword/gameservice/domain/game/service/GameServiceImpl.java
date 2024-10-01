package com.helloword.gameservice.domain.game.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.helloword.gameservice.domain.game.dto.request.GameLogRequestDto;
import com.helloword.gameservice.domain.game.dto.request.GameResultRequestDto;
import com.helloword.gameservice.domain.game.dto.request.UpdateCollectionRequestDto;
import com.helloword.gameservice.domain.game.dto.response.FairytaleGameResponseDto;
import com.helloword.gameservice.domain.game.dto.response.FairytaleWordResponseDto;
import com.helloword.gameservice.domain.game.dto.response.PairGameResponseDto;
import com.helloword.gameservice.domain.game.dto.response.PairWordResponseDto;
import com.helloword.gameservice.domain.game.dto.response.SpeechGameResponseDto;
import com.helloword.gameservice.domain.game.dto.response.SpeechWordResponseDto;
import com.helloword.gameservice.domain.game.dto.response.SpeedGameResponseDto;
import com.helloword.gameservice.domain.game.dto.response.SpeedWordResponseDto;
import com.helloword.gameservice.global.client.CollectionServiceClient;
import com.helloword.gameservice.global.client.LogServiceClient;
import com.helloword.gameservice.global.client.WordServiceClient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameServiceImpl implements GameService {

	private final WordServiceClient wordServiceClient;
	private final CollectionServiceClient collectionServiceClient;
	private final LogServiceClient logServiceClient;

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

	public FairytaleGameResponseDto getFairytaleGameCards(Long kidId) {
		FairytaleWordResponseDto fairytaleWordResponse = wordServiceClient.getFairytaleWords(kidId);

		List<FairytaleWordResponseDto.WordDto> incorrectWords = fairytaleWordResponse.getIncorrectWords();
		List<FairytaleGameResponseDto.RoundDto> rounds = new ArrayList<>();

		int incorrectWordIndex = 0;

		for (FairytaleWordResponseDto.SentenceDto sentenceDto : fairytaleWordResponse.getSentences()) {
			List<FairytaleGameResponseDto.WordDto> incorrectWordsForRound = incorrectWords
				.subList(incorrectWordIndex, incorrectWordIndex + 3).stream()
				.map(word -> new FairytaleGameResponseDto.WordDto(
					word.getWordId(),
					word.getWord()
				))
				.collect(Collectors.toList());

			FairytaleGameResponseDto.RoundDto round = new FairytaleGameResponseDto.RoundDto(
				sentenceDto.getSentence(),
				sentenceDto.getImageUrl(),
				sentenceDto.getSentenceOrder(),
				new FairytaleGameResponseDto.WordDto(
					sentenceDto.getCorrectWord().getWordId(),
					sentenceDto.getCorrectWord().getWord()
				),
				incorrectWordsForRound
			);

			rounds.add(round);
			incorrectWordIndex += 3;
		}

		return new FairytaleGameResponseDto(fairytaleWordResponse.getStoryTitle(),
			fairytaleWordResponse.getSentenceCount(), rounds);
	}

	@Override
	public void saveGameResult(GameResultRequestDto requestDto) {
		List<UpdateCollectionRequestDto.CollectionUpdateDto> collections = requestDto.getAnswerWords().stream()
			.map(answerWord -> new UpdateCollectionRequestDto.CollectionUpdateDto(
				answerWord.getId(),
				1
			))
			.collect(Collectors.toList());

		UpdateCollectionRequestDto updateCollectionRequest = new UpdateCollectionRequestDto(collections, requestDto.getKidId());
		collectionServiceClient.updateCollections(updateCollectionRequest);

		GameLogRequestDto gameLogRequest = new GameLogRequestDto(
			requestDto.getKidId(),
			requestDto.getGameType(),
			LocalDate.now(),
			requestDto.getPlayTime(),
			requestDto.getCorrectRate()
		);

		logServiceClient.saveGameLog(gameLogRequest);
	}
}
