package com.helloword.authservice.auth.dto.response;

import com.helloword.authservice.auth.model.Role;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserInfoResponseDto {
    private Long userId;
    private String username;
    private String password;
    private Role role;
}
