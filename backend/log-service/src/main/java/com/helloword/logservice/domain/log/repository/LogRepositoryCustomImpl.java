package com.helloword.logservice.domain.log.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.helloword.logservice.domain.log.model.GameType;
import com.helloword.logservice.domain.log.model.QLog;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;

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
	public Map<Integer, Integer> findWeeklyCorrectWordCount(Long kidId) {
		QLog log = QLog.log;

		List<Tuple> results = queryFactory.select(log.createdAt.week(), log.correctCount.sum())
			.from(log)
			.where(log.kidId.eq(kidId)
				.and(log.createdAt.after(LocalDate.now().minusWeeks(4))))
			.groupBy(log.createdAt.week())
			.fetch();

		return results.stream().collect(Collectors.toMap(
			tuple -> tuple.get(log.createdAt.week()),
			tuple -> tuple.get(log.correctCount.sum())
		));
	}

	@Override
	public Map<Integer, Integer> findMonthlyCorrectWordCount(Long kidId) {
		QLog log = QLog.log;

		List<Tuple> results = queryFactory.select(log.createdAt.month(), log.correctCount.sum())
			.from(log)
			.where(log.kidId.eq(kidId)
				.and(log.createdAt.after(LocalDate.now().minusMonths(4))))
			.groupBy(log.createdAt.month())
			.fetch();

		return results.stream().collect(Collectors.toMap(
			tuple -> tuple.get(log.createdAt.month()),
			tuple -> tuple.get(log.correctCount.sum())
		));
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
}

