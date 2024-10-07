package com.helloword.wordservice.domain.fairytale.repository;

import java.util.Optional;

import com.helloword.wordservice.domain.fairytale.model.Fairytale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FairytaleRepository extends JpaRepository<Fairytale, Long> {

	@Query("SELECT f FROM Fairytale f ORDER BY RAND() LIMIT 1")
	Optional<Fairytale> findRandomFairytale();
}
