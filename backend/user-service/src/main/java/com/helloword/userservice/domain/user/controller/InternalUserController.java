package com.helloword.userservice.domain.user.controller;

import com.helloword.userservice.domain.user.dto.request.LoginRequest;
import com.helloword.userservice.domain.user.dto.response.AuthenticateUserResponse;
import com.helloword.userservice.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/internal/users")
@RequiredArgsConstructor
@Tag(name = "[내부]유저 API", description = "서버 내부에서 통신하는 유저에 대한 API 입니다.")
public class InternalUserController {

    private final UserService userService;

    @Operation(summary = "로그인", description = "로그인 합니다.")
    @PostMapping
    public AuthenticateUserResponse login(@RequestBody LoginRequest loginRequest) {
        return userService.authenticateUser(loginRequest);
    }
}
