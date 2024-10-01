package com.helloword.kidservice.domain.kid.controller;

import com.helloword.kidservice.domain.kid.dto.request.UpdateExpRequestDto;
import com.helloword.kidservice.domain.kid.service.KidService;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Hidden
@RestController
@RequestMapping("/internal/kids")
@RequiredArgsConstructor
public class InternalKidController {
    private static KidService kidService;

    @PatchMapping("/exp")
    public void updateKidExp(@RequestBody UpdateExpRequestDto updateKidExpReuestDto) {
        kidService.increaseExperience(updateKidExpReuestDto);

    }
}
