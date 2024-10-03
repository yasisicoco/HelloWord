package com.helloword.apigateway.jwt;

import com.helloword.apigateway.exception.MainException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Base64;

import static com.helloword.apigateway.exception.CustomException.*;

@Component
@Slf4j
public class JwtUtil {

    private final Key key;

    public JwtUtil(@Value("${jwt.secret}") String secretKey) {
        this.key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secretKey));
    }

    public String validateToken(String token) throws MainException {
        try {
            String actualToken = removeBearer(token);

            Claims claims = Jwts.parser()
                    .verifyWith((SecretKey) key)
                    .build()
                    .parseSignedClaims(actualToken)
                    .getPayload();

            Long userId = claims.get("userId", Long.class);
            if (userId == null) {
                throw new MainException(INVALID_TOKEN);
            }

            return String.valueOf(userId);

        } catch (ExpiredJwtException e) {
            log.warn("Token expired: {}", e.getMessage());
            throw new MainException(EXPIRED_TOKEN);
        } catch (JwtException e) {
            log.warn("Invalid token: {}", e.getMessage());
            throw new MainException(INVALID_TOKEN);
        } catch (Exception e) {
            log.error("Token validation error: ", e);
            throw new MainException(INTERNAL_SERVER_ERROR);
        }
    }

    private String removeBearer(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        return token;
    }
}
