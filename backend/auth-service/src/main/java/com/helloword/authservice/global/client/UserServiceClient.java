package com.helloword.authservice.global.client;

import com.helloword.authservice.auth.dto.request.LoginRequestDto;
import com.helloword.authservice.auth.dto.response.UserInfoResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "user-service")
public interface UserServiceClient {
    @GetMapping("/api/users")
    ResponseEntity<UserInfoResponseDto> getUserByUsernameAndPassword(LoginRequestDto loginRequestDto);
}
