package com.helloword.kidservice.domain.kid.repository;

import com.helloword.kidservice.domain.kid.model.Kid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KidRepository extends JpaRepository<Kid, Long> {
}
