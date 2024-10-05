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

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

@RestController
@RequestMapping("/api/kids")
@RequiredArgsConstructor
@Tag(name = "아이 API", description = "아이에 대한 API 입니다.")
public class KidController {
    private final KidService kidService;

    @PostMapping
    @Operation(summary = "아이 등록", description = "요청한 정보로 아이를 등록합니다.")
    public KidResponseDto createKid(
            @RequestHeader("X-User-Id") Long userId,
            @RequestPart(value = "profileImage") MultipartFile profileImage,
            @Valid @RequestPart("kid") CraeteKidRequestDto craeteKidRequestDto
    ) {
        return kidService.createKid(userId, profileImage, craeteKidRequestDto);
    }

    @GetMapping
    @Operation(summary = "아이 목록 조회", description = "자신의 아이 목록을 조회합니다.")
    public List<KidResponseDto> getKidsByUserId(
            @RequestHeader("X-User-Id") Long userId
    ) {
        return kidService.getKidsByUserId(userId);
    }

    @GetMapping("/{kidId}")
    @Operation(summary = "해당 아이 조회", description = "해당 아이의 정보를 조회합니다.")
    public KidResponseDto getKid(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long kidId
    ) {
        return kidService.getKid(userId, kidId);
    }

    @PatchMapping("/{kidId}")
    @Operation(summary = "해당 아이 수정", description = "해당 아이의 정보를 수정합니다.")
    public KidResponseDto updateKid(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long kidId,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
            @ModelAttribute UpdateKidRequestDto updateKidRequestDto
    ) {
        return kidService.updateKid(userId, kidId, profileImage, updateKidRequestDto);
    }

    @PatchMapping("/{kidId}/character")
    @Operation(summary = "해당 아이의 캐릭터 변경", description = "해당 아이의 캐릭터를 변경합니다.")
    public KidResponseDto updateMainCharacter(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long kidId,
            @ModelAttribute UpdateMainCharactorRequestDto updateMainCharactorRequestDto
    ) {
        return kidService.updateMainCharacter(userId, kidId, updateMainCharactorRequestDto);
    }

    @DeleteMapping("/{kidId}")
    @Operation(summary = "해당 아이 삭제", description = "해당 아이를 삭제합니다.")
    public void deleteKid(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long kidId
    ) {
        kidService.deleteKid(userId, kidId);
    }
}