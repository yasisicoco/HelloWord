package com.helloword.wordservice.domain.word.dto.response;

import com.helloword.wordservice.domain.word.model.AnswerWordLog;

import java.util.List;

public record AnswerWordLogsResponseDto(
       List<AnswerWordLog> answerWordLogs
) {
}
