package com.helloword.userservice.domain.user.service;

import com.helloword.userservice.domain.user.dto.request.LoginRequest;
import com.helloword.userservice.domain.user.dto.request.NewPasswordRequest;
import com.helloword.userservice.domain.user.dto.request.SignupRequest;
import com.helloword.userservice.domain.user.dto.response.AuthenticateUserResponse;

public interface UserService {
    AuthenticateUserResponse authenticateUser(LoginRequest loginRequest);

    void registerUser(SignupRequest signupRequest);

    boolean checkDuplicateEmail(String email);

    boolean checkDuplicatePhone(String phone);

    void deleteUser(Long xUserId, Long userId);

    void updatePassword(Long xUserId, Long userId, NewPasswordRequest newPasswordRequest);
}
