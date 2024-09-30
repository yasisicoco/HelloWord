package com.helloword.userservice.domain.user.dto.response;

import com.helloword.userservice.domain.user.model.Role;
import com.helloword.userservice.domain.user.model.User;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class AuthenticateUserResponse {
    private Long id;
    private String username;
    private String email;
    private String password;
    private Role role;

    public static AuthenticateUserResponse toDto(User user) {
        return AuthenticateUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .password(user.getPassword())
                .role(Role.USER)
                .build();
    }
}
