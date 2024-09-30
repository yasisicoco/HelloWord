package com.helloword.wordservice.domain.recognitionrate.repository;

import com.helloword.wordservice.domain.recognitionrate.model.RecognitionRate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecognitionRateRepository extends JpaRepository<RecognitionRate, Long> {
}
