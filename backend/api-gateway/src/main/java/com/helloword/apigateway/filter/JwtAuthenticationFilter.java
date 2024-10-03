package com.helloword.apigateway.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.helloword.apigateway.exception.CustomException;
import com.helloword.apigateway.exception.ErrorResponse;
import com.helloword.apigateway.exception.MainException;
import com.helloword.apigateway.jwt.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
@Slf4j
public class JwtAuthenticationFilter implements WebFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        String path = request.getURI().getPath();
        if (path.startsWith("/api/auth/") ||
                path.startsWith("/api/users") ||
                path.startsWith("/api/users/check-duplicate/") ||
                path.startsWith("/internal/") ||
                path.startsWith("/actuator/")) {
            return chain.filter(exchange);
        }

        List<String> authHeader = request.getHeaders().get(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || authHeader.isEmpty()) {
            return onError(exchange, CustomException.INVALID_TOKEN);
        }

        try {
            String userId = jwtUtil.validateToken(authHeader.get(0));

            ServerHttpRequest modifiedRequest = request.mutate()
                    .header("X-USER-ID", userId)
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());

        } catch (MainException e) {
            return onError(exchange, e.getErrorCode());
        }
    }

    private Mono<Void> onError(ServerWebExchange exchange, CustomException exception) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(HttpStatus.valueOf(exception.getCode()));
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        ErrorResponse errorResponse = new ErrorResponse(exception.getCode(), exception.getMessage());

        try {
            byte[] bytes = new ObjectMapper().writeValueAsBytes(errorResponse);
            return response.writeWith(Mono.just(response.bufferFactory().wrap(bytes)));
        } catch (Exception e) {
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
            return response.setComplete();
        }
    }
}
