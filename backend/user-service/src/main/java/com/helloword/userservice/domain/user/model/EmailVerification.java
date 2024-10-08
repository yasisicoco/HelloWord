package com.helloword.userservice.domain.user.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

    @Entity
    @Getter
    @NoArgsConstructor(access = AccessLevel.PROTECTED)
    public class EmailVerification {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(unique = true)
        private String email;

        private String verificationCode;

        private boolean emailVerified;

        private LocalDateTime requestedAt;

        private static final long EXPIRATION_TIME_MINUTES = 6;

    @Builder
    private EmailVerification(String email, String verificationCode, boolean emailVerified, LocalDateTime requestedAt) {
        this.email = email;
        this.verificationCode = verificationCode;
        this.emailVerified = emailVerified;
        this.requestedAt = requestedAt;
    }

    public static EmailVerification createEmailVerification(String email) {
        return builder()
                .email(email)
                .verificationCode(generateVerificationCode())
                .emailVerified(false)
                .requestedAt(LocalDateTime.now())
                .build();
    }

    public void refreshVerificationCode() {
        this.verificationCode = generateVerificationCode();
        this.requestedAt = LocalDateTime.now();
    }

    public boolean isCodeValid() {
        return LocalDateTime.now().isBefore(this.requestedAt.plusMinutes(EXPIRATION_TIME_MINUTES));
    }

    private static String generateVerificationCode() {
        return String.valueOf((int) (Math.random() * 900000) + 100000);
    }

    public void updateEmailVerified() {
        this.emailVerified = true;
    }
}
