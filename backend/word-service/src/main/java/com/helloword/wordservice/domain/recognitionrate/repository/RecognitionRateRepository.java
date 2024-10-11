package com.helloword.wordservice.domain.recognitionrate.repository;

import com.helloword.wordservice.domain.recognitionrate.model.RecognitionRate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecognitionRateRepository extends JpaRepository<RecognitionRate, Long> {
    List<RecognitionRate> findAllByMonth(Integer kidMonth);
}
