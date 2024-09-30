package com.helloword.kidservice.domain.kid.controller;

import com.helloword.kidservice.domain.kid.service.KidService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/kids")
@RequiredArgsConstructor
public class KidController {
    private final KidService kidService;

    @PostMapping("/upload")
    public void uploadKidImage(@RequestParam("file") MultipartFile file) {
        String imageUrl = kidService.uploadKidImage(file);
        System.out.println(imageUrl);
    }

}