package com.helloword.userservice.user.model;

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

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "is_deleted", nullable = false)
    private boolean isDeleted;

    @Builder
    private User(Long id, String username, String password, String phone, boolean isDeleted) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.phone = phone;
        this.isDeleted = isDeleted;
    }

    @PrePersist
    public void prePersist() {
        this.isDeleted = false;
    }

    public void changePassword(String password) {
        this.password = password;
    }
}
