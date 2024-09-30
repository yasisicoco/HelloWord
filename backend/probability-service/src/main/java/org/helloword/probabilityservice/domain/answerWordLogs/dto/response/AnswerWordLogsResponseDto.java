package org.helloword.probabilityservice.domain.answerWordLogs.dto.response;

import java.util.List;

import org.helloword.probabilityservice.domain.answerWordLogs.model.AnswerWordLog;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class AnswerWordLogsResponseDto {

	private List<AnswerWordLog> answerWordLogs;

	public static AnswerWordLogsResponseDto createAnswerWordLogsResponseDto(List<AnswerWordLog> answerWordLogs) {
		return new AnswerWordLogsResponseDto(answerWordLogs);
	}
}
