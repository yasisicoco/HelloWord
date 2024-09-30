package com.helloword.kidservice.domain.kid.service;

import com.helloword.kidservice.global.utils.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RequiredArgsConstructor
@Service
public class KidServiceImpl implements KidService {

    private final FileService fileService;

    @Override
    public String uploadKidImage(MultipartFile file) {
        return fileService.uploadImage(file);
    }
}
