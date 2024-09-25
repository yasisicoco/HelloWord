package org.helloword.probabilityservice.domain.answerWordLogs.model;

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
public class AnswerWordLogs {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Long kidId;

	@Column(nullable = false)
	private Long wordId;

	@Column(nullable = false)
	private Double probability;

	private AnswerWordLogs(Long kidId, Long wordId, Double probability) {
		this.kidId = kidId;
		this.wordId = wordId;
		this.probability = probability;
	}

	public static AnswerWordLogs createAnswerWordLogs(Long kidId, Long wordId, Double probability) {
		return new AnswerWordLogs(kidId, wordId, probability);
	}

}
