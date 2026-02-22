# 모두의 리뷰 (All Reviews Hub) MVP

리뷰 메타서치/요약 서비스 MVP입니다. 검색어 1개로 다양한 출처의 리뷰를 모으고, 리뷰성 필터링 및 요약을 제공합니다.

## 1) 전체 설계 요약
- **수집 계층**: `Connector` 인터페이스 기반 플러그인 구조. 소스별 활성/비활성 가능.
- **법적 준수**: allowlist 도메인만 수집, crawler user-agent 명시, snippet만 저장/표시.
- **검색 처리**: 입력 정규화(언어/카테고리 추정) → 커넥터 병렬 호출 → URL 중복 제거.
- **리뷰 필터**: 휴리스틱 기반 `reviewProbability` 계산으로 광고/판매성 제외.
- **요약/분석**: 장점/단점/키워드/감성 추출 및 결론 생성.
- **신뢰도 점수(0~100)**: 출처 다양성 + 리뷰 개수 + 최신성 + 리뷰성 확률 조합.
- **비동기 파이프라인**: BullMQ 큐에 후속 재요약 job enqueue.
- **UX**: 자동완성(최근 검색 localStorage + 서버 트렌드), 결과 카드/출처 리스트.

## 2) 레포 구조
```text
.
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── search/route.ts
│   │   │   └── trending/route.ts
│   │   ├── results/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── providers.tsx
│   │   └── search-box.tsx
│   ├── lib/
│   │   ├── cache/redis.ts
│   │   ├── classifier/review-classifier.ts
│   │   ├── connectors/*.ts
│   │   ├── pipeline/*.ts
│   │   ├── queue/index.ts
│   │   ├── scoring/confidence.ts
│   │   ├── summarizer/summarizer.ts
│   │   ├── search-input.ts
│   │   ├── search-service.ts
│   │   └── types.ts
│   ├── tests/
│   │   ├── classifier.test.ts
│   │   ├── scoring.test.ts
│   │   └── summarizer.test.ts
│   └── worker/worker.ts
├── .env.example
└── README.md
```

## 3) DB 스키마
- `Entity`: 검색 대상(제품/장소)
- `Source`: 출처 메타
- `ReviewItem`: 스니펫 기반 리뷰 아이템
- `Summary`: 전체/출처별 요약
- `SearchTrend`: 인기 키워드 집계

자세한 정의는 `prisma/schema.prisma` 참고.

## 4) 백엔드
- `GET /api/search?q=...`: 검색/필터/요약/신뢰도 계산
- `GET /api/trending`: 인기 키워드
- Connector 예시 2개:
  - `NaverBlogConnector`
  - `PublicRssConnector`

## 5) 프론트
- `/`: 검색창 + 자동완성
- `/results?q=...`: 요약 카드, 키워드, 출처별 리뷰 리스트

## 6) 크롤링/요약 파이프라인
- `fetchHtml` + Readability로 본문 추출
- summary queue (`BullMQ`)로 비동기 재요약 작업 등록
- worker에서 job 소비 (`npm run worker`)

## 7) 테스트 전략
- 분류기: 리뷰/광고성 구분 점수 확인
- 신뢰도 점수: 다양성/최신성 반영 확인
- 요약기: snippet 길이 제한과 감성 계산 확인

## 8) 환경 변수
`.env.example` 참고.

## 9) 로컬 실행
```bash
npm install
cp .env.example .env
npm run db:generate
npm run dev
```

별도 worker 실행:
```bash
npm run worker
```
