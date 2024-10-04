package com.helloword.kidservice.domain.kid.service;

import com.helloword.kidservice.domain.kid.dto.request.*;
import com.helloword.kidservice.domain.kid.dto.response.KidResponseDto;
import com.helloword.kidservice.domain.kid.model.Kid;
import com.helloword.kidservice.domain.kid.repository.KidRepository;
import com.helloword.kidservice.global.client.CollectionServiceClient;
import com.helloword.kidservice.global.client.ProbabilityServiceClient;
import com.helloword.kidservice.global.exception.MainException;
import com.helloword.kidservice.global.utils.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

import static com.helloword.kidservice.global.exception.CustomException.KID_FORBIDDEN;
import static com.helloword.kidservice.global.exception.CustomException.KID_NOT_FOUND;

@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class KidServiceImpl implements KidService {

    private final FileService fileService;
    private final KidRepository kidRepository;
    private final ProbabilityServiceClient probabilityServiceClient;
    private final CollectionServiceClient collectionServiceClient;

    @Transactional
    @Override
    public KidResponseDto createKid(Long userId, MultipartFile profileImage, CraeteKidRequestDto craeteKidRequestDto) {

        String profileImageUrl = !profileImage.isEmpty()
                ? fileService.uploadImage(profileImage)
                : null;

        Kid kid = Kid.createKid(
                userId,
                craeteKidRequestDto.name(),
                craeteKidRequestDto.birthDate(),
                craeteKidRequestDto.gender(),
                profileImageUrl
        );
        kidRepository.save(kid);

        probabilityServiceClient.createAnswerWordLog(new CreateAnswerWordLogRequestDto(kid.getId()));
        collectionServiceClient.createCollections(new CreateCollectionRequestDto(kid.getId()));

        return new KidResponseDto(kid);
    }

    @Override
    public List<KidResponseDto> getKidsByUserId(Long userId) {
        return  kidRepository.findByUserId(userId)
                .stream()
                .map(KidResponseDto::new)  // Kid -> KidResponseDto 변환
                .collect(Collectors.toList());
    }

    @Override
    public KidResponseDto getKid(Long userId, Long kidId) {
        Kid kid = findKidById(kidId);
        checkOwnership(kid.getUserId(), userId);
        return new KidResponseDto(kid);
    }

    @Transactional
    @Override
    public KidResponseDto updateKid(Long userId, Long kidId, MultipartFile profileImage, UpdateKidRequestDto updateKidRequestDto) {
        Kid kid = findKidById(kidId);
        checkOwnership(kid.getUserId(), userId);

        String profileImageUrl = !profileImage.isEmpty()
                ? fileService.uploadImage(profileImage)
                : null;

        kid.updateKidInfo(
                updateKidRequestDto.name(),
                updateKidRequestDto.birthDate(),
                updateKidRequestDto.gender(),
                profileImageUrl
        );

        return new KidResponseDto(kid);
    }

    @Transactional
    @Override
    public KidResponseDto updateMainCharacter(Long userId, Long kidId, UpdateMainCharactorRequestDto updateMainCharactorRequestDto) {
        Kid kid = findKidById(kidId);
        checkOwnership(kid.getUserId(), userId);

        kid.changeMainCharacter(updateMainCharactorRequestDto.mainCharacter());

        return new KidResponseDto(kid);
    }

    @Transactional
    @Override
    public void deleteKid(Long userId, Long kidId) {
        Kid kid = findKidById(kidId);
        checkOwnership(kid.getUserId(), userId);
        kidRepository.delete(kid);
    }

    @Transactional
    @Override
    public void increaseExperience(UpdateExpRequestDto updateExpRequestDto) {
        Kid kid = findKidById(updateExpRequestDto.kidId());

        kid.addExperience(updateExpRequestDto.exp());

        kidRepository.save(kid);
    }

    @Override
    public Integer getKidAgeById(Long kidId) {
        Kid kid = findKidById(kidId);
        LocalDate birthDate = kid.getBirthDate();
        LocalDate currentDate = LocalDate.now();

        // 현재 날짜와 아이의 생일 사이의 차이를 개월 수로 계산
        Period period = Period.between(birthDate, currentDate);
        int ageInMonths = period.getYears() * 12 + period.getMonths();
        return ageInMonths;
    }

    private Kid findKidById(Long kidId) {
        return kidRepository.findById(kidId)
                .orElseThrow(() -> new MainException(KID_NOT_FOUND));
    }

    private void checkOwnership(Long ownerId, Long requestUserId) {
        if (!ownerId.equals(requestUserId)) {
            throw new MainException(KID_FORBIDDEN);
        }
    }
}
