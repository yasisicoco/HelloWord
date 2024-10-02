package com.helloword.logservice.domain.log.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.helloword.logservice.domain.log.model.Log;

public interface LogRepository extends JpaRepository<Log, Long>, LogRepositoryCustom {
}
