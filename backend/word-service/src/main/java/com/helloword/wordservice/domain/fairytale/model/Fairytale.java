package com.helloword.wordservice.domain.fairytale.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Table(name = "fairytales")
@Getter
@NoArgsConstructor(access = PROTECTED)
public class Fairytale {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private Fairytale(String title) {
        this.title = title;
    }

    public static Fairytale createFairytale(String title) {
        return new Fairytale(title);
    }
}
