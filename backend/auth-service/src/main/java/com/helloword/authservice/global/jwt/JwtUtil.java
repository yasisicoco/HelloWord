package com.helloword.authservice.global.jwt;

import com.helloword.authservice.domain.auth.dto.response.AuthenticateUserResponse;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key key;
    private final long expirationTime;

    public JwtUtil(@Value("${jwt.secret}") String secretKey, @Value("${jwt.expiration}") long expirationTime) {
        this.key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secretKey));
        this.expirationTime = expirationTime;
    }

    public JwtToken generateToken(AuthenticateUserResponse authenticateUserResponse) {
        String accessToken = Jwts.builder()
                .claim("userId", authenticateUserResponse.getUserId())
                .claim("username", authenticateUserResponse.getUsername())
                .claim("role", authenticateUserResponse.getRole())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key)
                .compact();

        String refreshToken = Jwts.builder()
                .claim("userId", authenticateUserResponse.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationTime * 2))
                .signWith(key)
                .compact();

        return JwtToken.builder()
                .grantType("Bearer")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}
