package com.helloword.collectionservice.domain.collection.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.helloword.collectionservice.domain.collection.model.Collection;

public interface CollectionRepository extends JpaRepository<Collection, Long> {
	List<Collection> findByKidId(Long kidId);
	Optional<Collection> findByKidIdAndWordId(Long kidId, Long wordId);
}
