package com.helloword.authservice.domain.auth.controller;

import com.helloword.authservice.domain.auth.dto.request.LoginRequestDto;
import com.helloword.authservice.domain.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "인증 API", description = "인증 API에 대한 설명입니다.")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "로그인", description = "로그인 정보를 확인 후 토큰을 반환합니다.")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
        return ResponseEntity.ok(authService.getnerateJwtToken(loginRequestDto));
    }

    @Operation(summary = "테스트", description = "테스트용")
    @GetMapping("/test")
    public String test() {
        return "test";
    }
}
