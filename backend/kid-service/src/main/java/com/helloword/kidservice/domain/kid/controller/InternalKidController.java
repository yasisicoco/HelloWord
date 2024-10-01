package com.helloword.kidservice.domain.kid.controller;

import com.helloword.kidservice.domain.kid.dto.request.UpdateExpRequestDto;
import com.helloword.kidservice.domain.kid.service.KidService;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Hidden
@RestController
@RequestMapping("/internal/kids")
@RequiredArgsConstructor
public class InternalKidController {
    private final KidService kidService;

    @PatchMapping("/exp")
        public void updateKidExp(@ModelAttribute UpdateExpRequestDto updateExpRequestDto) {
        kidService.increaseExperience(updateExpRequestDto);
    }
}
