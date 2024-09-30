package com.helloword.kidservice.domain.character.service;

import com.helloword.kidservice.domain.character.model.Character;
import com.helloword.kidservice.domain.character.model.CharacterType;
import com.helloword.kidservice.domain.character.repository.CharacterRepository;
import com.helloword.kidservice.domain.kid.model.Kid;
import com.helloword.kidservice.global.exception.MainException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.helloword.kidservice.global.exception.CustomException.NOT_FOUND;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class CharacterServiceImpl implements CharacterService {
    private static CharacterRepository characterRepository;

    @Transactional
    @Override
    public void createCharacters(Kid kid) {
        for (CharacterType type : CharacterType.values()) {
            characterRepository.save(Character.ctreateCharacter(kid, type.name(), type, 1, 0));
        }
    }

    @Override
    public List<Character> getCharactersByKidId(Kid kid) {
        return characterRepository.findByKid(kid);
    }

    @Override
    public Character getCharacter(Long characterId) {
        return characterRepository.findById(characterId).orElseThrow(() -> new MainException(NOT_FOUND));
    }

    @Transactional
    public Character increaseExperience(Long characterId, int experiencePoints) {
        Character character = characterRepository.findById(characterId)
                .orElseThrow(() -> new MainException(NOT_FOUND));

        character.addExperience(experiencePoints);

        characterRepository.save(character);

        return character;
    }
}
