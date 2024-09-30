package com.helloword.kidservice.domain.kid.service;

import org.springframework.web.multipart.MultipartFile;

public interface KidService {
    String uploadKidImage(MultipartFile file);
}
