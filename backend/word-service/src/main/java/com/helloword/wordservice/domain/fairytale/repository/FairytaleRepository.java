package com.helloword.wordservice.domain.fairytale.repository;

import com.helloword.wordservice.domain.fairytale.model.Fairytale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FairytaleRepository extends JpaRepository<Fairytale, Long> {
}
