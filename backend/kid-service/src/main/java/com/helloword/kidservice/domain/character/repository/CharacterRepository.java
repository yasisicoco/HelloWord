package com.helloword.kidservice.domain.character.repository;

import com.helloword.kidservice.domain.character.model.Character;
import com.helloword.kidservice.domain.kid.model.Kid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CharacterRepository extends JpaRepository<Character, Long> {
    List<Character> findByKid(Kid kid);
}
