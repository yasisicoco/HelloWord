package com.helloword.kidservice.domain.kid.controller;

import com.helloword.kidservice.domain.kid.dto.request.UpdateExpRequestDto;
import com.helloword.kidservice.domain.kid.service.KidService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/internal/kids")
@RequiredArgsConstructor
@Tag(name = "[내부]아이 API", description = "서버 내부에서 통신하는 아이에 대한 API 입니다.")
public class InternalKidController {
    private final KidService kidService;

    @PutMapping("/exp")
    @Operation(summary = "아이 경험치 수정", description = "요청한 정보로 아이의 경험치를 수정합니다.")
    public void updateKidExp(@ModelAttribute UpdateExpRequestDto updateExpRequestDto) {
        kidService.increaseExperience(updateExpRequestDto);
    }
}
