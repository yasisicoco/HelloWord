package org.helloword.probabilityservice.domain.answerWordLogs.repository;

import java.util.List;

import org.helloword.probabilityservice.domain.answerWordLogs.model.AnswerWordLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerWordLogRepository extends JpaRepository<AnswerWordLog, Long> {
	List<AnswerWordLog> findByKidId(Long kidId);
}
