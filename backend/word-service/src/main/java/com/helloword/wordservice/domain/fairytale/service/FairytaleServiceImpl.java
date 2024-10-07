package com.helloword.wordservice.domain.fairytale.service;

import com.helloword.wordservice.domain.fairytale.dto.response.FairytaleResponseDto;
import com.helloword.wordservice.domain.fairytale.repository.FairytaleRepository;
import com.helloword.wordservice.domain.fairytale.repository.FairytaleSentenceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FairytaleServiceImpl implements FairytaleService {
    private final FairytaleRepository fairytaleRepository;
    private final FairytaleSentenceRepository fairytaleSentenceRepository;

    @Override
    public FairytaleResponseDto getFairytale() {
        FairytaleResponseDto fairytaleResponseDto = new FairytaleResponseDto(
                "해님과 달님",
                5,
                List.of(
                        new FairytaleResponseDto.Sentence(
                                "옛날에 엄마와 오빠, 동생이 살았어요. 어느 날 호랑이가 ##ceperator##를 잡아먹었어요.",
                                "https://hellowordbucketb206.s3.ap-northeast-2.amazonaws.com/25ae7071-2f4d-49d0-a690-4e828d96ef1e.jpg",
                                1,
                                new FairytaleResponseDto.Word(
                                        "엄마",
                                        127L
                                )
                        ),
                        new FairytaleResponseDto.Sentence(
                                "오빠와 동생은 무서워서 ##ceperator## 위로 올라갔어요.",
                                "https://hellowordbucketb206.s3.ap-northeast-2.amazonaws.com/8384f5bc-fc38-4b98-9800-75fef4e5373d.jpg",
                                2,
                                new FairytaleResponseDto.Word(
                                        "나무",
                                        33L
                                )
                        ),
                        new FairytaleResponseDto.Sentence(
                                "하늘에서 줄을 내려줘서 오빠와 동생은 ##ceperator##로 올라갔어요.",
                                "https://hellowordbucketb206.s3.ap-northeast-2.amazonaws.com/9ae3a642-c8cf-4720-8b9a-4d0e22c4973d.jpg",
                                3,
                                new FairytaleResponseDto.Word(
                                        "하늘",
                                        194L
                                )
                        ),
                        new FairytaleResponseDto.Sentence(
                                "##ceperator##도 따라가려다가 줄이 끊어져서 떨어졌어요.",
                                "https://hellowordbucketb206.s3.ap-northeast-2.amazonaws.com/ef0e1cf7-6cf4-4834-8dd2-d3500264ee62.jpg",
                                4,
                                new FairytaleResponseDto.Word(
                                        "호랑이",
                                        199L
                                )
                        ),
                        new FairytaleResponseDto.Sentence(
                                "그래서 오빠는 달이 되고, 동생은 ##ceperator##가 되었답니다.",
                                "https://hellowordbucketb206.s3.ap-northeast-2.amazonaws.com/8ffe5c83-d0a0-47a7-9bda-6ff4f58fd9aa.jpg",
                                5,
                                new FairytaleResponseDto.Word(
                                        "해",
                                        197L
                                )
                        )
                ),
                List.of(
                        new FairytaleResponseDto.Word(
                                "텔레비전",
                                178L
                        ),
                        new FairytaleResponseDto.Word(
                                "크레파스",
                                175L
                        ),
                        new FairytaleResponseDto.Word(
                                "자동차",
                                147L
                        ),
                        new FairytaleResponseDto.Word(
                                "강아지",
                                5L
                        ),
                        new FairytaleResponseDto.Word(
                                "가방",
                                1L
                        ),
                        new FairytaleResponseDto.Word(
                                "꽃",
                                31L
                        ),
                        new FairytaleResponseDto.Word(
                                "돌",
                                44L
                        ),
                        new FairytaleResponseDto.Word(
                                "돼지",
                                47L
                        ),
                        new FairytaleResponseDto.Word(
                                "바다",
                                69L
                        ),
                        new FairytaleResponseDto.Word(
                                "병원",
                                82L
                        ),
                        new FairytaleResponseDto.Word(
                                "사과",
                                91L
                        ),
                        new FairytaleResponseDto.Word(
                                "선생님",
                                100L
                        ),
                        new FairytaleResponseDto.Word(
                                "수박",
                                110L
                        ),
                        new FairytaleResponseDto.Word(
                                "우유",
                                138L
                        ),
                        new FairytaleResponseDto.Word(
                                "전화",
                                150L
                        )
                )
        );
        return fairytaleResponseDto;
    }
}
