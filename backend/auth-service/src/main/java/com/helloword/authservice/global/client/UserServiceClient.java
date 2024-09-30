package com.helloword.authservice.global.client;

import com.helloword.authservice.domain.auth.dto.request.LoginRequestDto;
import com.helloword.authservice.domain.auth.dto.response.AuthenticateUserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @PostMapping("/internal/users")
    AuthenticateUserResponse login(@RequestBody LoginRequestDto loginRequestDto);
}
