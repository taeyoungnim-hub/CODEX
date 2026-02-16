export interface SopTemplate {
  id: string;
  title: string;
  content: string;
}

export const sopTemplates: SopTemplate[] = [
  {
    id: "economy-writing",
    title: "경제 글쓰기",
    content: `[경제 글쓰기 SOP]\n입력: 주제/독자수준/기간/관점\n절차: 용어정의→핵심주장3→반대논리2→지표후보→사례1~2→조건부전망\n출력: 제목10개/아웃라인/1200~2000자 본문/리스크·면책\n체크리스트: 과잉확신금지, 상관·인과 구분, 숫자 출처표시`
  },
  {
    id: "reading",
    title: "독서(요약/적용)",
    content: `[독서 SOP]\n입력: 텍스트/목적/적용분야\n절차: 주장→근거→반례→내상황적용→실행항목\n출력: 1페이지 요약/적용액션7/인용구10\n체크리스트: 즉시실천 1개 도출`
  },
  {
    id: "investment",
    title: "투자 분석",
    content: `[투자 분석 SOP]\n입력: 자산/매수가/기간/레버리지\n절차: 3시나리오/현금흐름·DSCR·금리민감도/출구전략2/리스크레지스터\n출력: 투자메모/시나리오표/리스크대응\n체크리스트: 망하는 케이스 먼저, 가정 숫자 명시`
  },
  {
    id: "vibe-coding",
    title: "바이브 코딩",
    content: `[바이브 코딩 SOP]\n입력: 기능요구/화면/데이터/예외/성공기준\n절차: 유저스토리10/와이어프레임/데이터모델·라우팅/API스펙/테스트\n출력: 구현순서/파일트리/TODO\n체크리스트: MVP 우선, provider adapter 유지`
  }
];
