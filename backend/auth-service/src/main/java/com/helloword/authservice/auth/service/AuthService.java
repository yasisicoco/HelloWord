package com.helloword.authservice.auth.service;

import com.helloword.authservice.auth.dto.response.UserInfoResponseDto;
import com.helloword.authservice.global.jwt.JwtToken;

public interface AuthService {
    String getnerateJwtToken(UserInfoResponseDto userInfo);
}
