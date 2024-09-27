package com.helloword.authservice.auth.controller;

import com.helloword.authservice.auth.dto.request.LoginRequestDto;
import com.helloword.authservice.auth.dto.response.UserInfoResponseDto;
import com.helloword.authservice.auth.service.AuthService;
import com.helloword.authservice.global.client.UserServiceClient;
import com.helloword.authservice.global.jwt.JwtToken;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserServiceClient userServiceClient;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
        ResponseEntity<UserInfoResponseDto> response = userServiceClient.getUserByUsernameAndPassword(loginRequestDto);

        if (response.getStatusCode() == HttpStatus.UNAUTHORIZED) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        UserInfoResponseDto userInfo = response.getBody();

        String jwtToken = authService.getnerateJwtToken(userInfo);

        return ResponseEntity.ok(jwtToken);
    }
}
