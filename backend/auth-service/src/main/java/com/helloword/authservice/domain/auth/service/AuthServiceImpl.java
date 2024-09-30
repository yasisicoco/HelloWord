package com.helloword.authservice.domain.auth.service;

import com.helloword.authservice.domain.auth.dto.request.LoginRequestDto;
import com.helloword.authservice.domain.auth.dto.response.AuthenticateUserResponse;
import com.helloword.authservice.global.client.UserServiceClient;
import com.helloword.authservice.global.exception.CustomException;
import com.helloword.authservice.global.exception.ExceptionResponse;
import com.helloword.authservice.global.jwt.JwtToken;
import com.helloword.authservice.global.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final JwtUtil jwtUtil;
    private final UserServiceClient userServiceClient;

    @Override
    public JwtToken getnerateJwtToken(LoginRequestDto loginRequestDto) {
        try {
            AuthenticateUserResponse authenticateUserResponse = userServiceClient.login(loginRequestDto);
            return jwtUtil.generateToken(authenticateUserResponse);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ExceptionResponse(CustomException.NOT_FOUND);
        }
    }
}
