package com.helloword.authservice.global.jwt;

import com.helloword.authservice.auth.dto.response.UserInfoResponseDto;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET_KEY = "your-secret-key";
    byte[] keyBytes = Base64.getDecoder().decode(SECRET_KEY);
    Key key = new SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.getJcaName());

    public String generateToken(UserInfoResponseDto userInfoResponseDto) {
        return Jwts.builder()
                .claim("userId", userInfoResponseDto.getUsername())
                .claim("username", userInfoResponseDto.getPassword())
                .claim("role", userInfoResponseDto.getRole())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(key)
                .compact();
    }
}
