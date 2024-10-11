package com.helloword.collectionservice.domain.collection.model;

import java.time.LocalDate;

import com.helloword.collectionservice.domain.collection.dto.request.CreateCollectionRequestDto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "collections")
public class Collection {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private Long kidId;

	@Column(nullable = false)
	private Long wordId;

	@Column(nullable = false)
	private Integer count;

	@Column(nullable = false)
	private Boolean isCompleted;

	@Column
	private LocalDate completionDate;

	@Builder
	private Collection(Long kidId, Long wordId, Integer count, Boolean isCompleted) {
		this.kidId = kidId;
		this.wordId = wordId;
		this.count = count;
		this.isCompleted = isCompleted;
	}

	public static Collection createCollection(CreateCollectionRequestDto requestDto, Long wordId) {
		return Collection.builder()
			.kidId(requestDto.getKidId())
			.wordId(wordId)
			.count(0)
			.isCompleted(Boolean.FALSE)
			.build();
	}

	public boolean updateCount(int count) {
		this.count += count;
		if (this.count == 3) {
			updateIsCompleted();
			return true;
		}
		return false;
	}

	private void updateIsCompleted() {
		this.isCompleted = true;
		this.completionDate = LocalDate.now();
	}
}
