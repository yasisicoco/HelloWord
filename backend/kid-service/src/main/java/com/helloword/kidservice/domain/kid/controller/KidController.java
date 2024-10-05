package com.helloword.kidservice.domain.kid.controller;

import com.helloword.kidservice.domain.kid.dto.request.CraeteKidRequestDto;
import com.helloword.kidservice.domain.kid.dto.request.UpdateKidRequestDto;
import com.helloword.kidservice.domain.kid.dto.request.UpdateMainCharactorRequestDto;
import com.helloword.kidservice.domain.kid.dto.response.KidResponseDto;
import com.helloword.kidservice.domain.kid.service.KidService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/kids")
@RequiredArgsConstructor
@Tag(name = "아이 API", description = "아이에 대한 API 입니다.")
public class KidController {
    private final KidService kidService;

    @Operation(summary = "아이 등록", description = "요청한 정보로 아이를 등록합니다.")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public KidResponseDto createKid(
            @RequestHeader("X-User-Id") Long userId,
            @RequestPart(value = "profileImage") MultipartFile profileImage,
            @Valid @RequestPart("kid") CraeteKidRequestDto craeteKidRequestDto
    ) {
        return kidService.createKid(userId, profileImage, craeteKidRequestDto);
    }

    @Operation(summary = "아이 목록 조회", description = "자신의 아이 목록을 조회합니다.")
    @GetMapping
    public List<KidResponseDto> getKidsByUserId(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return kidService.getKidsByUserId(userId);
    }

    @Operation(summary = "해당 아이 조회", description = "해당 아이의 정보를 조회합니다.")
    @GetMapping("/{kidId}")
    public KidResponseDto getKid(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long kidId
    ) {
        return kidService.getKid(userId, kidId);
    }

    @Operation(summary = "해당 아이 수정", description = "해당 아이의 정보를 수정합니다.")
    @PatchMapping(value = "/{kidId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public KidResponseDto updateKid(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long kidId,
            @RequestPart(value = "profileImage") MultipartFile profileImage,
            @Valid @RequestPart("kid") UpdateKidRequestDto updateKidRequestDto
    ) {
        return kidService.updateKid(userId, kidId, profileImage, updateKidRequestDto);
    }

    @Operation(summary = "해당 아이의 캐릭터 변경", description = "해당 아이의 캐릭터를 변경합니다.")
    @PatchMapping("/{kidId}/character")
    public KidResponseDto updateMainCharacter(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long kidId,
            @ModelAttribute UpdateMainCharactorRequestDto updateMainCharactorRequestDto
    ) {
        return kidService.updateMainCharacter(userId, kidId, updateMainCharactorRequestDto);
    }

    @Operation(summary = "해당 아이 삭제", description = "해당 아이를 삭제합니다.")
    @DeleteMapping("/{kidId}")
    public void deleteKid(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long kidId
    ) {
        kidService.deleteKid(userId, kidId);
    }
}