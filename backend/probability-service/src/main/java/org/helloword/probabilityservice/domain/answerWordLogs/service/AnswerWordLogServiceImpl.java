package org.helloword.probabilityservice.domain.answerWordLogs.service;

import java.util.ArrayList;
import java.util.List;

import org.helloword.probabilityservice.domain.answerWordLogs.dto.request.CreateAnswerWordLogRequestDto;
import org.helloword.probabilityservice.domain.answerWordLogs.dto.response.AnswerWordLogsResponseDto;
import org.helloword.probabilityservice.domain.answerWordLogs.model.AnswerWordLog;
import org.helloword.probabilityservice.domain.answerWordLogs.repository.AnswerWordLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class AnswerWordLogServiceImpl implements AnswerWordLogService {

	private final AnswerWordLogRepository answerWordLogRepository;

	public AnswerWordLogsResponseDto getLogsByKidId(Long kidId) {
		return AnswerWordLogsResponseDto.createAnswerWordLogsResponseDto(answerWordLogRepository.findByKidId(kidId));
	}

	@Transactional
	public void createAnswerWordLogs(CreateAnswerWordLogRequestDto requestDto) {
		// TODO: word-service에서 word count를 받아서 200 대신 사용
		double probability = 1.0 / 200.0;
		List<AnswerWordLog> answerWordLogs = new ArrayList<>();

		for (long wordId = 1; wordId <= 200; wordId++) {
			AnswerWordLog answerWordLog = AnswerWordLog.createAnswerWordLogs(requestDto, wordId, probability);
			answerWordLogs.add(answerWordLog);
		}

		answerWordLogRepository.saveAll(answerWordLogs);
	}

}
