package com.helloword.userservice.domain.user.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SignupRequest {
    private String username;
    private String email;
    private String password;
    private String phone;
}
