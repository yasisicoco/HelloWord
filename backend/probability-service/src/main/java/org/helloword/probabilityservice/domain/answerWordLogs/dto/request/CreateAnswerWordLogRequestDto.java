package org.helloword.probabilityservice.domain.answerWordLogs.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class CreateAnswerWordLogRequestDto {

	@NotNull
	private Long kidId;
}
