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
import com.helloword.gameservice.domain.game.dto.response.GameWordResponseDto;
import com.helloword.gameservice.domain.game.dto.response.PairGameResponseDto;
import com.helloword.gameservice.domain.game.dto.response.SpeechGameResponseDto;
import com.helloword.gameservice.domain.game.dto.response.SpeedGameResponseDto;
import com.helloword.gameservice.global.client.CollectionServiceClient;
import com.helloword.gameservice.global.client.KidServiceClient;
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
	private final KidServiceClient kidServiceClient;

	public SpeedGameResponseDto getSpeedGameCards(Long kidId) {
		GameWordResponseDto gameWordResponse = wordServiceClient.getGameWords(kidId, 20);

		List<GameWordResponseDto.WordDto> words = gameWordResponse.getWords();
		List<GameWordResponseDto.WordDto> correctWords = words.subList(0, 5);
		List<GameWordResponseDto.WordDto> incorrectWords = words.subList(5, 20);

		List<SpeedGameResponseDto.RoundDto> rounds = new ArrayList<>();
		for (int i = 0; i < correctWords.size(); i++) {
			GameWordResponseDto.WordDto correctWord = correctWords.get(i);
			SpeedGameResponseDto.CorrectWordDto correctWordDto = new SpeedGameResponseDto.CorrectWordDto(
				correctWord.getWordId(),
				correctWord.getWord(),
				correctWord.getImageUrl(),
				correctWord.getVoiceUrl()
			);

			List<SpeedGameResponseDto.IncorrectWordDto> incorrectWordDtos = incorrectWords.subList(i * 3, (i + 1) * 3).stream()
				.map(incorrectWord -> new SpeedGameResponseDto.IncorrectWordDto(
					incorrectWord.getWordId(),
					incorrectWord.getWord()
				))
				.collect(Collectors.toList());

			SpeedGameResponseDto.RoundDto roundDto = new SpeedGameResponseDto.RoundDto(correctWordDto, incorrectWordDtos);
			rounds.add(roundDto);
		}

		boolean needsTutorial = kidServiceClient.changeIsSpeedGameTutorialCompleted(kidId);

		return new SpeedGameResponseDto(rounds, needsTutorial);
	}

	public SpeechGameResponseDto getSpeechGameCards(Long kidId) {
		GameWordResponseDto gameWordResponse = wordServiceClient.getGameWords(kidId, 5);

		List<SpeechGameResponseDto.RoundDto> rounds = gameWordResponse.getWords().stream()
			.map(word -> new SpeechGameResponseDto.RoundDto(
				word.getWordId(),
				word.getWord(),
				word.getImageUrl()
			))
			.collect(Collectors.toList());

		boolean needsTutorial = kidServiceClient.changeIsSpeechGameTutorialCompleted(kidId);

		return new SpeechGameResponseDto(rounds, needsTutorial);
	}

	public PairGameResponseDto getPairGameCards(Long kidId) {
		GameWordResponseDto gameWordResponse = wordServiceClient.getGameWords(kidId, 12);

		List<PairGameResponseDto.RoundDto> rounds = new ArrayList<>();
		List<GameWordResponseDto.WordDto> words = gameWordResponse.getWords();

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

		boolean needsTutorial = kidServiceClient.changeIsPairGameTutorialCompleted(kidId);

		return new PairGameResponseDto(rounds, needsTutorial);
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

		boolean needsTutorial = kidServiceClient.changeIsFairytaleGameTutorialCompleted(kidId);

		return new FairytaleGameResponseDto(fairytaleWordResponse.getStoryTitle(),
			fairytaleWordResponse.getSentenceCount(), rounds, needsTutorial);
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
			requestDto.getPlayTime(),
			requestDto.getCorrectRate(),
			requestDto.getCorrectCount()
		);

		logServiceClient.saveGameLog(gameLogRequest);
	}
}
