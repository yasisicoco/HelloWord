package org.helloword.probabilityservice.domain.answerWordLogs.model;

import org.helloword.probabilityservice.domain.answerWordLogs.dto.request.CreateAnswerWordLogRequestDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "answer_word_logs")
public class AnswerWordLog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Long kidId;

	@Column(nullable = false)
	private Long wordId;

	@Column(nullable = false)
	private Double probability;

	private AnswerWordLog(Long kidId, Long wordId, Double probability) {
		this.kidId = kidId;
		this.wordId = wordId;
		this.probability = probability;
	}

	public static AnswerWordLog createAnswerWordLogs(CreateAnswerWordLogRequestDto requestDto, Long wordId, Double probability) {
		return new AnswerWordLog(requestDto.getKidId(), wordId, probability);
	}

}
