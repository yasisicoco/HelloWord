package org.helloword.probabilityservice.domain.answerWordLogs.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@RequestMapping("/internal/probability")
@Slf4j
@Tag(name = "[내부]확률 API", description = "서버 내부에서 통신하는 확률에 대한 API 입니다.")
public class InternalAnswerWordLogController {

	private final AnswerWordLogService answerWordLogService;

    @Operation(summary = "아이 단어 확률 조회", description = "해당 아이의 모든 단어의 확률을 조회 합니다.")
	@GetMapping
    public AnswerWordLogsResponseDto getAnswerWordLogs(@RequestParam("kidId") Long kidId) {
		AnswerWordLogsResponseDto responseDto = answerWordLogService.getLogsByKidId(kidId);

		log.info("probability service - request: kidId {}", kidId);
		log.info("probability service - response: {}", responseDto);
		return responseDto;
	}

    @Operation(summary = "아이 단어 확률 생성", description = "해당 아이의 모든 단어의 확률을 생성 합니다.")
	@PostMapping
    public void createAnswerWordLog(@RequestBody CreateAnswerWordLogRequestDto requestDto) {
		answerWordLogService.createAnswerWordLogs(requestDto);

		log.info("probability service - request: {}", requestDto);
		log.info("probability service - response: create ok");
	}

}
