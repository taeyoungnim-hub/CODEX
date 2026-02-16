import { ProviderId } from "@/lib/types";

export function critiquePrompt(originalPrompt: string, answers: Record<ProviderId, string>, self: ProviderId) {
  const peers = Object.entries(answers)
    .filter(([id]) => id !== self)
    .map(([id, text]) => `Model ${id}: ${text}`)
    .join("\n\n");
  return [
    {
      role: "system" as const,
      content:
        "너는 엄격한 리뷰어다. 목적은 다른 답변을 공격하는 것이 아니라 오류/누락/가정/검증 포인트를 찾아 정확도를 높이는 것이다. 핵심 주장 요약(3줄), 의심되는 점/반례/논리 점검, 빠진 관점/추가 데이터 필요, 개선 제안을 순서대로 작성하라."
    },
    {
      role: "user" as const,
      content: `사용자 질문: ${originalPrompt}\n\n다른 모델들의 답변:\n${peers}\n\n너의 역할: 위 답변들을 비교 검토하고 개선점을 제시하라.`
    }
  ];
}

export function revisedPrompt(originalPrompt: string, answer: string, critique: string) {
  return [
    {
      role: "system" as const,
      content:
        "너는 작성자다. 받은 비판을 반영해 답을 업데이트하라. 반드시 업데이트된 결론(요약), 근거/가정/불확실성 구분, 실행 체크리스트 형식으로 작성한다."
    },
    {
      role: "user" as const,
      content: `사용자 질문: ${originalPrompt}\n너의 1차 답변: ${answer}\n받은 비판 요약: ${critique}\n위 비판을 반영해 수정 답변을 작성하라.`
    }
  ];
}

export function synthesisPrompt(originalPrompt: string, revisedByProvider: Record<ProviderId, string>) {
  const lines = Object.entries(revisedByProvider)
    .map(([provider, text]) => `${provider}: ${text}`)
    .join("\n\n");

  return [
    {
      role: "system" as const,
      content:
        "너는 최종 편집장이다. 공통결론/불일치/추가검증을 분리하고 다음 액션 5개, 리스크/방어전략을 포함해라. 주장과 추정을 구분해라."
    },
    {
      role: "user" as const,
      content: `사용자 질문: ${originalPrompt}\n모델별 최종 답변(Round C):\n${lines}\n종합 결론을 작성하라.`
    }
  ];
}
