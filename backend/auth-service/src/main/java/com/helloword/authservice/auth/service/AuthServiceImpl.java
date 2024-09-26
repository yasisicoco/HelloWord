package com.helloword.authservice.auth.service;

import com.helloword.authservice.auth.dto.response.UserInfoResponseDto;
import com.helloword.authservice.global.jwt.JwtToken;
import com.helloword.authservice.global.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final JwtUtil jwtUtil;

    @Override
    public String getnerateJwtToken(UserInfoResponseDto userInfoResponseDto) {
        return jwtUtil.generateToken(userInfoResponseDto);
    }
}
