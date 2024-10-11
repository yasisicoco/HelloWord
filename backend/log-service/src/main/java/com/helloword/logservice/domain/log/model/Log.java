package com.helloword.logservice.domain.log.model;

import java.time.LocalDate;

import com.helloword.logservice.domain.log.dto.request.CreateLogRequestDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "logs")
public class Log {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Long kidId;

	@Column(nullable = false)
	private LocalDate createdAt;

	@Column(nullable = false)
	private GameType gameType;

	@Column(nullable = false)
	private Integer playTime;

	@Column(nullable = false)
	private Double correctRate;

	@Column(nullable = false)
	private Integer correctCount;

	@Builder
	private Log(Long kidId, GameType gameType, Integer playTime, Double correctRate, Integer correctCount) {
		this.kidId = kidId;
		this.createdAt = LocalDate.now();
		this.gameType = gameType;
		this.playTime = playTime;
		this.correctRate = correctRate;
		this.correctCount = correctCount;
	}

	public static Log createLog(CreateLogRequestDto requestDto) {
		return Log.builder()
			.kidId(requestDto.getKidId())
			.gameType(requestDto.getGameType())
			.playTime(requestDto.getPlayTime())
			.correctRate(requestDto.getCorrectRate())
			.correctCount(requestDto.getCorrectCount())
			.build();
	}

}
