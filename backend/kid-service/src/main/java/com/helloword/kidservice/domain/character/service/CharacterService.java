package com.helloword.kidservice.domain.character.service;

import com.helloword.kidservice.domain.character.model.Character;
import com.helloword.kidservice.domain.kid.model.Kid;

import java.util.List;

public interface CharacterService {
    void createCharacters(Kid kid);

    List<Character> getCharactersByKidId(Kid kid);

    Character getCharacter(Long characterId);

}
