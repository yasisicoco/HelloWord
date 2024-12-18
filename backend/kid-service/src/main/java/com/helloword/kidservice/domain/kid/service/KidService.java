package com.helloword.kidservice.domain.kid.service;

import com.helloword.kidservice.domain.kid.dto.request.CraeteKidRequestDto;
import com.helloword.kidservice.domain.kid.dto.request.KidExpUpdateRequestDto;
import com.helloword.kidservice.domain.kid.dto.request.UpdateKidRequestDto;
import com.helloword.kidservice.domain.kid.dto.request.UpdateMainCharactorRequestDto;
import com.helloword.kidservice.domain.kid.dto.response.GameStatsResponseDto;
import com.helloword.kidservice.domain.kid.dto.response.KidResponseDto;
import com.helloword.kidservice.domain.kid.dto.response.LearningStatsResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface KidService {
    KidResponseDto createKid(Long userId, MultipartFile profileImage, CraeteKidRequestDto craeteKidRequestDto);

    List<KidResponseDto> getKidsByUserId(Long userId);

    KidResponseDto getKid(Long userId, Long kidId);

    KidResponseDto updateKid(Long userId, Long kidId, MultipartFile profileImage, UpdateKidRequestDto updateKidRequestDto);

    KidResponseDto updateMainCharacter(Long userId, Long kidId, UpdateMainCharactorRequestDto updateMainCharactorRequestDto);

    void deleteKid(Long userId, Long kidId);

    void increaseExperience(KidExpUpdateRequestDto kidExpUpdateRequestDto);

    Integer getKidAgeById(Long kidId);

    LearningStatsResponseDto getLearningStats(Long userId, Long kidId);

    GameStatsResponseDto getGameStats(Long userId, Long kidId);

    boolean changeIsSpeedGameTutorialCompleted(Long kidId);

    boolean changeIsSpeechGameTutorialCompleted(Long kidId);

    boolean changeIsPairGameTutorialCompleted(Long kidId);

    boolean changeIsFairytaleGameTutorialCompleted(Long kidId);
}
