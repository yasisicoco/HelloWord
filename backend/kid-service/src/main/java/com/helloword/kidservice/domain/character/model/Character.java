package com.helloword.kidservice.domain.character.model;

import com.helloword.kidservice.domain.kid.model.Kid;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Table(name = "characters")
@Getter
@NoArgsConstructor(access = PROTECTED)
public class Character {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kid_id", nullable = false)
    private Kid kid;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CharacterType type;

    @Column(nullable = false)
    private int level;

    @Column(nullable = false)
    private int experience;

    @Builder
    private Character(Kid kid, String name, CharacterType type, int level, int experience) {
        this.kid = kid;
        this.name = name;
        this.type = type;
        this.level = level;
        this.experience = experience;
    }

    public static Character ctreateCharacter(Kid kid, String name, CharacterType type, int level, int experience) {
        return builder()
                .kid(kid)
                .name(name)
                .type(type)
                .level(level)
                .experience(experience)
                .build();
    }

    public void addExperience(int experiencePoints) {
        this.experience += experiencePoints;
        // 필요하다면 레벨 업 로직을 여기에 추가할 수 있습니다.
    }
}
