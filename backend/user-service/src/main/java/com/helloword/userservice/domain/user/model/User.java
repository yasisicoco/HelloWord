package com.helloword.userservice.domain.user.model;

import com.helloword.userservice.domain.user.dto.request.SignupRequest;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted;

    @Builder
    private User(Long id, String email, String username, String password, String phone, boolean isDeleted) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.isDeleted = isDeleted;
    }

    public static User createUser(SignupRequest signupRequest) {
        return User.builder()
                .username(signupRequest.getUsername())
                .email(signupRequest.getEmail())
                .password(signupRequest.getPassword())
                .phone(signupRequest.getPhone())
                .build();
    }

    @PrePersist
    public void prePersist() {
        this.isDeleted = false;
    }

    public void changePassword(String password) {
        this.password = password;
    }
}
