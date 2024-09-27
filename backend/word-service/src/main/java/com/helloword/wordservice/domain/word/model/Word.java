package com.helloword.wordservice.domain.word.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Table(name = "words")
@Getter
@NoArgsConstructor(access = PROTECTED)
public class Word {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String word;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private String voiceUrl;

    private Word(String word, String imageUrl, String voiceUrl) {
        this.word = word;
        this.imageUrl = imageUrl;
        this.voiceUrl = voiceUrl;
    }

    public static Word createWord(String word, String imageUrl, String voiceUrl) {
        return new Word(word, imageUrl, voiceUrl);
    }

}
