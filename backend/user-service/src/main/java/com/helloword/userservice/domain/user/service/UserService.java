package com.helloword.userservice.domain.user.service;

import com.helloword.userservice.domain.user.dto.request.*;
import com.helloword.userservice.domain.user.dto.response.AuthenticateUserResponse;
import com.helloword.userservice.domain.user.dto.response.VerifyCodeResponseDto;

public interface UserService {
    AuthenticateUserResponse authenticateUser(LoginRequest loginRequest);

    void registerUser(SignupRequest signupRequest);

    boolean checkDuplicateEmail(String email);

    boolean checkDuplicatePhone(String phone);

    void deleteUser(Long xUserId, Long userId);

    void updatePassword(Long xUserId, Long userId, NewPasswordRequest newPasswordRequest);

    void sendEmailCode(SendCodeRequestDto sendCodeRequestDto);

    void verifyEmailCode(VerifyCodeRequestDto verifyCodeRequestDto);

    void sendTempPassword(SendTempPasswordRequestDto sendTempPasswordRequestDto);
}
