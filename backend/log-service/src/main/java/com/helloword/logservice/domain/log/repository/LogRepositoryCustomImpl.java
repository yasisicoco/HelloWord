package com.helloword.logservice.domain.log.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.helloword.logservice.domain.log.model.GameType;
import com.helloword.logservice.domain.log.model.QLog;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LogRepositoryCustomImpl implements LogRepositoryCustom {

	private final JPAQueryFactory queryFactory;

	public LogRepositoryCustomImpl(JPAQueryFactory queryFactory) {
		this.queryFactory = queryFactory;
	}

	@Override
	public Integer findTodayTotalPlayTime(Long kidId) {
		QLog log = QLog.log;

		return queryFactory.select(log.playTime.sum())
			.from(log)
			.where(log.kidId.eq(kidId)
				.and(log.createdAt.eq(LocalDate.now())))
			.fetchOne();
	}

	@Override
	public Integer findTodayCompletedGameCount(Long kidId) {
		QLog log = QLog.log;

		return queryFactory.select(log.count())
			.from(log)
			.where(log.kidId.eq(kidId)
				.and(log.createdAt.eq(LocalDate.now())))
			.fetchOne().intValue();
	}

	@Override
	public Map<String, Integer> findDailyCorrectWordCount(Long kidId) {
		QLog log = QLog.log;

		List<Tuple> results = queryFactory.select(log.createdAt.dayOfWeek(), log.correctCount.sum())
			.from(log)
			.where(log.kidId.eq(kidId)
				.and(log.createdAt.after(LocalDate.now().minusDays(7))))
			.groupBy(log.createdAt.dayOfWeek())
			.fetch();

		return results.stream().collect(Collectors.toMap(
			tuple -> convertDayOfWeek(tuple.get(log.createdAt.dayOfWeek())),
			tuple -> tuple.get(log.correctCount.sum())
		));
	}

	private String convertDayOfWeek(Integer dayOfWeek) {
		switch (dayOfWeek) {
			case 1: return "일";
			case 2: return "월";
			case 3: return "화";
			case 4: return "수";
			case 5: return "목";
			case 6: return "금";
			case 7: return "토";
			default: return "";
		}
	}

	@Override
	public Double findKidAverageCorrectRateByGameType(Long kidId, GameType gameType) {
		QLog log = QLog.log;

		return queryFactory.select(log.correctRate.avg())
			.from(log)
			.where(log.kidId.eq(kidId)
				.and(log.gameType.eq(gameType)))
			.fetchOne();
	}

	@Override
	public Double findGlobalAverageCorrectRateByGameType(GameType gameType) {
		QLog log = QLog.log;

		return queryFactory.select(log.correctRate.avg())
			.from(log)
			.where(log.gameType.eq(gameType))
			.fetchOne();
	}

	@Override
	public Double findKidAveragePlayTimeByGameType(Long kidId, GameType gameType) {
		QLog log = QLog.log;

		return queryFactory.select(log.playTime.avg())
			.from(log)
			.where(log.kidId.eq(kidId)
				.and(log.gameType.eq(gameType)))
			.fetchOne();
	}

	@Override
	public Double findGlobalAveragePlayTimeByGameType(GameType gameType) {
		QLog log = QLog.log;

		return queryFactory.select(log.playTime.avg())
			.from(log)
			.where(log.gameType.eq(gameType))
			.fetchOne();
	}

}

