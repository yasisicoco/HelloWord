package com.helloword.authservice.domain.auth.dto.response;

import com.helloword.authservice.domain.auth.model.Role;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class AuthenticateUserResponse {
    private Long userId;
    private String username;
    private String email;
    private String password;
    private Role role;
}
