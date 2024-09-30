package com.helloword.authservice.domain.auth.service;

import com.helloword.authservice.domain.auth.dto.request.LoginRequestDto;
import com.helloword.authservice.global.jwt.JwtToken;

public interface AuthService {
    JwtToken getnerateJwtToken(LoginRequestDto loginRequestDto);
}
