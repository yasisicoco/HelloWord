package com.helloword.wordservice.domain.fairytale.model;

import com.helloword.wordservice.domain.word.model.Word;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Table(name = "fairytale_sentences")
@Getter
@NoArgsConstructor(access = PROTECTED)
public class FairytaleSentence {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "word_id", nullable = false)
    private Word word;

    @Column(nullable = false)
    private Long fairytaleId;

    @Column(nullable = false)
    private String sentence;

    @Column(nullable = false)
    private String imageUrl;

    @Column(nullable = false)
    private Integer sequence;

    @Builder
    private FairytaleSentence(Word word, Long fairytaleId, String sentence, String imageUrl, Integer sequence) {
        this.word = word;
        this.fairytaleId = fairytaleId;
        this.sentence = sentence;
        this.imageUrl = imageUrl;
        this.sequence = sequence;
    }

    public static FairytaleSentence createFairytaleSentence(Word word, Long fairytaleId, String sentence, String imageUrl, Integer sequence) {
        return builder()
                .word(word)
                .fairytaleId(fairytaleId)
                .sentence(sentence)
                .imageUrl(imageUrl)
                .sequence(sequence)
                .build();
    }
}
