package com.helloword.userservice.domain.user.controller;

import com.helloword.userservice.domain.user.dto.request.*;
import com.helloword.userservice.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
@Tag(name = "유저 API", description = "유저에 대한 API 입니다.")
public class UserController {

    private final UserService userService;

    @Operation(summary = "회원 가입", description = "유저 정보를 받아 등록합니다.")
    @PostMapping
    public void signup(@RequestBody SignupRequest signupRequest) {
        userService.registerUser(signupRequest);
    }

    @Operation(summary = "이메일 중복 체크", description = "이메일 중복을 확인합니다.")
    @GetMapping("/check-duplicate/email")
    public boolean checkDuplicateEmail(@RequestParam String email) {
        return userService.checkDuplicateEmail(email);
    }

    @Operation(summary = "휴대폰번호 중복 체크", description = "휴대폰번호를 중복을 확인합니다.")
    @GetMapping("/check-duplicate/phone")
    public boolean checkDuplicatePhone(@RequestParam String phone) {
        return userService.checkDuplicatePhone(phone);
    }

    @Operation(summary = "회원 삭제", description = "회원을 삭제합니다.")
    @DeleteMapping("/{userId}")
    public void withdrawal(@RequestHeader("X-User-Id") Long xUserId, @PathVariable Long userId) {
        userService.deleteUser(xUserId, userId);
    }

    @Operation(summary = "회원 패스워드 변경", description = "회원의 패스워드를 변경합니다.")
    @PatchMapping("/{userId}")
    public void changePassword(@RequestHeader("X-User-Id") Long xUserId, @PathVariable Long userId, @RequestBody NewPasswordRequest newPasswordRequest) {
        userService.updatePassword(xUserId, userId, newPasswordRequest);
    }

    @Operation(summary = "이메일 인증 코드 요청", description = "인증코드를 생성하여 이메일로 전송합니다.")
    @PostMapping("/send-code")
    public void sendEmailCode(@RequestBody SendCodeRequestDto sendCodeRequestDto) {
        userService.sendEmailCode(sendCodeRequestDto);
    }

    @Operation(summary = "이메일 인증 코드 확인", description = "인증코드를 확인합니다.")
    @PostMapping("/verify-code")
    public void verifyCode(@RequestBody VerifyCodeRequestDto verifyCodeRequestDto) {
        userService.verifyEmailCode(verifyCodeRequestDto);
    }

    @Operation(summary = "임시 비밀번호 발급", description = "임시비밀번호를 발급하여 이메일로 전송합니다.")
    @PostMapping("/send-password")
    public void sendTempPassword(@RequestBody SendTempPasswordRequestDto sendTempPasswordRequestDto) {
        userService.sendTempPassword(sendTempPasswordRequestDto);
    }
}
