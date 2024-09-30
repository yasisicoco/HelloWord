package org.helloword.probabilityservice.domain.answerWordLogs.controller;

import org.helloword.probabilityservice.domain.answerWordLogs.dto.request.CreateAnswerWordLogRequestDto;
import org.helloword.probabilityservice.domain.answerWordLogs.dto.response.AnswerWordLogsResponseDto;
import org.helloword.probabilityservice.domain.answerWordLogs.service.AnswerWordLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/probability/internal")
@Slf4j
public class InternalAnswerWordLogController {

	private final AnswerWordLogService answerWordLogService;

	@GetMapping
	public AnswerWordLogsResponseDto getAnswerWordLogs(@RequestParam("kidId") Long kidId) {
		AnswerWordLogsResponseDto responseDto = answerWordLogService.getLogsByKidId(kidId);

		log.info("probability service - request: kidId {}", kidId);
		log.info("probability service - response: {}", responseDto);
		return responseDto;
	}

	@PostMapping
	public void createAnswerWordLog(@RequestBody CreateAnswerWordLogRequestDto requestDto) {
		answerWordLogService.createAnswerWordLogs(requestDto);

		log.info("probability service - request: {}", requestDto);
		log.info("probability service - response: create ok");
	}

}
