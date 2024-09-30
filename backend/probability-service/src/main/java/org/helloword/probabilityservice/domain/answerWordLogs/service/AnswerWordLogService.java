package org.helloword.probabilityservice.domain.answerWordLogs.service;

import org.helloword.probabilityservice.domain.answerWordLogs.dto.request.CreateAnswerWordLogRequestDto;
import org.helloword.probabilityservice.domain.answerWordLogs.dto.response.AnswerWordLogsResponseDto;

public interface AnswerWordLogService {
	AnswerWordLogsResponseDto getLogsByKidId(Long kidId);
	void createAnswerWordLogs(CreateAnswerWordLogRequestDto requestDto);
}
