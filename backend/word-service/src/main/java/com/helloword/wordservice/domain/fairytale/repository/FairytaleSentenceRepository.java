package com.helloword.wordservice.domain.fairytale.repository;

import java.util.List;

import com.helloword.wordservice.domain.fairytale.model.FairytaleSentence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FairytaleSentenceRepository extends JpaRepository<FairytaleSentence, Long> {

	List<FairytaleSentence> findByFairytaleId(Long fairytaleId);
}
