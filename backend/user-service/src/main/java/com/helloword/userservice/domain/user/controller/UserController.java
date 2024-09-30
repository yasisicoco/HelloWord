package com.helloword.userservice.domain.user.controller;

import com.helloword.userservice.domain.user.dto.request.NewPasswordRequest;
import com.helloword.userservice.domain.user.dto.request.SignupRequest;
import com.helloword.userservice.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping
    public void signup(@RequestBody SignupRequest signupRequest) {
        userService.registerUser(signupRequest);
    }

    @GetMapping("/check-duplicate/email")
    public boolean checkDuplicateEmail(@RequestParam String email) {
        return userService.checkDuplicateEmail(email);
    }

    @GetMapping("/check-duplicate/phone")
    public boolean checkDuplicatePhone(@RequestParam String phone) {
        return userService.checkDuplicatePhone(phone);
    }

    @DeleteMapping("/{userId}")
    public void withdrawal(@PathVariable Long userId) {
        userService.deleteUser(userId);
    }

    @PatchMapping("/{userId}")
    public void changePassword(@PathVariable Long userId, @RequestBody NewPasswordRequest newPasswordRequest) {
        userService.updatePassword(userId, newPasswordRequest);
    }
}
