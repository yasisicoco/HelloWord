package com.helloword.authservice.domain.auth.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class LoginRequestDto {
    private String email;
    private String password;
}
