package com.helloword.kidservice.domain.kid.model;

import com.helloword.kidservice.domain.character.model.Character;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Table(name = "kids")
@Getter
@NoArgsConstructor(access = PROTECTED)
public class Kid {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(nullable = false)

    private String profileImageUrl;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "main_character_id")
    private Character mainCharacter;

    @Builder
    private Kid(Long userId, String name, LocalDate birthDate, Gender gender, String profileImageUrl, Character mainCharacter) {
        this.userId = userId;
        this.name = name;
        this.birthDate = birthDate;
        this.gender = gender;
        this.profileImageUrl = profileImageUrl;
        this.mainCharacter = mainCharacter;
    }

    public static Kid createKid(Long userId, String name, LocalDate birthDate, Gender gender, String profileImageUrl, Character mainCharacter) {
        return builder()
                .userId(userId)
                .name(name)
                .birthDate(birthDate)
                .gender(gender)
                .profileImageUrl(profileImageUrl)
                .mainCharacter(mainCharacter)
                .build();
    }
}
