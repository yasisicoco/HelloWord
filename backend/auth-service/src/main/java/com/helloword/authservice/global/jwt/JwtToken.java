package com.helloword.authservice.global.jwt;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class JwtToken {
    private String grantType;
    private String accessToken;
    private String refreshToken;
}
