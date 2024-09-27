package com.helloword.wordservice.domain.word.repository;

import com.helloword.wordservice.domain.word.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WordRepository extends JpaRepository<Word, Long> {
}
