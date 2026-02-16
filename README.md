# PolyAI Panel (MVP)

6개 AI 모델 패널을 병렬 실행하고, 심층(Deep) 모드에서 상호비판 라운드(A/B/C) + ChatGPT 최종 합성을 수행하는 Next.js MVP입니다.

## 1) 파일 트리

```text
.
├── app/
│   ├── api/
│   │   ├── run/route.ts          # Deep 라운드 오케스트레이션
│   │   └── stream/route.ts       # provider 단위 NDJSON 스트리밍
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # 메인 화면
├── components/
│   ├── ProviderPanel.tsx
│   ├── SettingsModal.tsx
│   ├── SopModal.tsx
│   └── TopBar.tsx
├── lib/
│   ├── data/
│   │   ├── presets.ts            # 간단/보통/심층 프리셋 + 모델 매핑
│   │   └── sops.ts               # 내장 SOP 템플릿
│   ├── providers/
│   │   ├── base.ts               # stub 공통 베이스
│   │   ├── index.ts              # provider registry
│   │   ├── openai.ts             # 실제 OpenAI 스트리밍 구현
│   │   └── stubs.ts              # Gemini/Claude/DeepSeek/Grok/Perplexity stub
│   ├── state/useAppStore.ts      # Zustand + localStorage
│   ├── workflows/prompts.ts      # Round B/C + synthesis 프롬프트 템플릿
│   └── types.ts                  # 공통 타입/인터페이스
├── package.json
└── README.md
```

## 2) 핵심 컴포넌트/상태/데이터 구조

- **TopBar**: 프리셋, 모드 전환(Single/Multi), Run/Stop, Settings/SOP, 테마 토글.
- **ProviderPanel (6개)**: 모델명, 상태(connected/streaming/error), 탭(Answer/Critique/Revised/Meta), Multi 모드 입력.
- **SettingsModal**: provider별 API key 1화면 입력.
- **SopModal**: 경제 글쓰기/독서/투자 분석/바이브 코딩 템플릿 주입.

상태는 Zustand로 관리하며 다음을 localStorage에 저장합니다.
- preset, mode, darkMode
- prompt
- provider별 model/status/round outputs/history
- finalSynthesis
- apiKeys(개발용 로컬 저장)

## 3) MVP 동작

### 병렬 실행 (Single Prompt)
- `Run` 클릭 시 `/api/stream`를 provider별 병렬 호출.
- NDJSON 토큰을 읽어 패널별 스트리밍 표시.
- 에러는 패널 status/error로 표시.
- `Stop` 클릭 시 AbortController로 요청 중단.

### 심층 연구 (Deep preset)
- `/api/run`에서 Round A(답변) → Round B(상호비판) → Round C(수정안) 순서 자동 진행.
- 이후 OpenAI(ChatGPT)로 Final Synthesis 생성.
- 패널 탭과 상단 Final Synthesis 섹션에 결과 반영.

### Provider Adapter 패턴
- 공통 인터페이스: `sendMessage({messages, model, temperature, maxTokens, stream})`.
- OpenAI는 실제 SSE 스트리밍 구현.
- 나머지 provider는 stub으로 동작하며 이후 실제 SDK/API로 교체 가능.

## 4) 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## 5) 환경변수

MVP에서는 Settings 모달에 키 입력 후 로컬 저장을 기본으로 사용합니다.
향후 서버 보관(암호화 DB/KMS) 시 아래 형태로 확장 가능:

```bash
OPENAI_API_KEY=
ENCRYPTION_SECRET=
DATABASE_URL=
```

## 6) 확장 가이드

1. `lib/providers/stubs.ts`의 provider를 실제 구현 파일로 교체.
2. `/api/run`에 rate-limit/timeout/retry 표준 처리 추가.
3. Prisma + Postgres로 세션/히스토리/키(암호화) 저장.
4. 토큰/비용 추정기, 복사 버튼, 템플릿 저장 기능 고도화.
