package com.helloword.wordservice.domain.word.repository;

import java.util.List;

import com.helloword.wordservice.domain.word.model.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WordRepository extends JpaRepository<Word, Long> {

	@Query("SELECT w FROM Word w WHERE w.id NOT IN :excludeIds ORDER BY RAND() LIMIT :limit")
	List<Word> findRandomWordsExcluding(@Param("excludeIds") List<Long> excludeIds, @Param("limit") int limit);
}
