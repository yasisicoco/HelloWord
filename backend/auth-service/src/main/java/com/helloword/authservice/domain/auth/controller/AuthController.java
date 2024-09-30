package com.helloword.authservice.domain.auth.controller;

import com.helloword.authservice.domain.auth.dto.request.LoginRequestDto;
import com.helloword.authservice.domain.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
        return ResponseEntity.ok(authService.getnerateJwtToken(loginRequestDto));
    }

    @GetMapping("/test")
    public String test() {
        return "test";
    }
}
