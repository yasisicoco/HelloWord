package com.helloword.kidservice.domain.kid.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import static jakarta.persistence.EnumType.STRING;
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

    @Enumerated(STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(nullable = false)
    private String profileImageUrl;

    @Column(nullable = false)
    private int level;

    @Column(nullable = false)
    private int experience;

    @Enumerated(STRING)
    @Column(nullable = false)
    private Character mainCharacter;

    @Column(nullable = false)
    private Boolean isSpeedGameTutorialCompleted;

    @Column(nullable = false)
    private Boolean isSpeechGameTutorialCompleted;

    @Column(nullable = false)
    private Boolean isPairGameTutorialCompleted;

    @Column(nullable = false)
    private Boolean isFairytaleGameTutorialCompleted;

    @Builder
    private Kid(Long userId, String name, LocalDate birthDate, Gender gender, String profileImageUrl) {
        this.userId = userId;
        this.name = name;
        this.birthDate = birthDate;
        this.gender = gender;
        this.profileImageUrl = (profileImageUrl != null) ? profileImageUrl : "";
        this.mainCharacter = Character.DUSTY;
        this.level = 0;
        this.experience = 0;
        this.isSpeedGameTutorialCompleted = Boolean.FALSE;
        this.isSpeechGameTutorialCompleted = Boolean.FALSE;
        this.isPairGameTutorialCompleted = Boolean.FALSE;
        this.isFairytaleGameTutorialCompleted = Boolean.FALSE;
    }

    public static Kid createKid(Long userId, String name, LocalDate birthDate, Gender gender, String profileImageUrl) {
        return builder()
                .userId(userId)
                .name(name)
                .birthDate(birthDate)
                .gender(gender)
                .profileImageUrl(profileImageUrl)
                .build();
    }

    public static final int requiredExperience = 100;
    public void addExperience(int experiencePoints) {
        this.experience += experiencePoints;

        while (this.experience >= requiredExperience) {
            this.experience -= requiredExperience;
            this.level++;
        }
    }

    public void updateKidInfo(String name, LocalDate birthDate, Gender gender, String profileImageUrl) {
        this.name = name;
        this.birthDate = birthDate;
        this.gender = gender;
        if(profileImageUrl != null) this.profileImageUrl = profileImageUrl;
    }

    public void changeMainCharacter(Character newCharacter) {
        this.mainCharacter = newCharacter;
    }

    public boolean changeIsSpeedGameTutorialCompleted() {
        if (!isSpeedGameTutorialCompleted) {
            isSpeedGameTutorialCompleted = true;
            return true;
        }
        return false;
    }

    public boolean changeIsSpeechGameTutorialCompleted() {
        if (!isSpeechGameTutorialCompleted) {
            isSpeechGameTutorialCompleted = true;
            return true;
        }
        return false;
    }

    public boolean changeIsPairGameTutorialCompleted() {
        if (!isPairGameTutorialCompleted) {
            isPairGameTutorialCompleted = true;
            return true;
        }
        return false;
    }

    public boolean changeIsFairytaleGameTutorialCompleted() {
        if (!isFairytaleGameTutorialCompleted) {
            isFairytaleGameTutorialCompleted = true;
            return true;
        }
        return false;
    }

}
