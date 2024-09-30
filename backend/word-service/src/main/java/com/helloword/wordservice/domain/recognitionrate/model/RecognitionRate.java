package com.helloword.wordservice.domain.recognitionrate.model;

import com.helloword.wordservice.domain.word.model.Word;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@Table(name = "recognition_rates")
@Getter
@NoArgsConstructor(access = PROTECTED)
public class RecognitionRate {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "word_id", nullable = false)
    private com.helloword.wordservice.domain.word.model.Word word;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Float rate;

    private RecognitionRate(com.helloword.wordservice.domain.word.model.Word word, Integer month, Float rate) {
        this.word = word;
        this.month = month;
        this.rate = rate;
    }

    public static RecognitionRate createRecognitionRate(Word word, Integer month, Float rate) {
        return new RecognitionRate(word, month, rate);
    }
}
