package com.helloword.userservice.domain.user.controller;

import com.helloword.userservice.domain.user.dto.request.LoginRequest;
import com.helloword.userservice.domain.user.dto.response.AuthenticateUserResponse;
import com.helloword.userservice.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/internal/users")
@RequiredArgsConstructor
public class InternalUserController {

    private final UserService userService;

    @PostMapping
    public AuthenticateUserResponse login(@RequestBody LoginRequest loginRequest) {
        return userService.authenticateUser(loginRequest);
    }
}
