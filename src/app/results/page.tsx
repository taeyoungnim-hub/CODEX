'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

type SearchResponse = {
  meta: { query: string; totalReviews: number; trustScore: number };
  summary: {
    conclusion: string;
    pros: string[];
    cons: string[];
    keywords: string[];
    confidence: number;
    recommendFor: string[];
    notRecommendFor: string[];
  };
  sources: Array<{
    sourceName: string;
    sourceDomain: string;
    url: string;
    title?: string;
    publishedAt?: string;
    rating?: number;
    snippet: string;
    sentimentScore: number;
  }>;
};

async function fetchSearch(q: string): Promise<SearchResponse> {
  const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
  if (!response.ok) throw new Error('검색 실패');
  return response.json();
}

export default function ResultsPage() {
  const params = useSearchParams();
  const q = params.get('q') ?? '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', q],
    queryFn: () => fetchSearch(q),
    enabled: q.length > 0
  });

  if (!q) return <main className="p-8">검색어가 없습니다.</main>;

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-8">
      {isLoading && <div className="animate-pulse rounded-lg bg-white p-6">리뷰를 모으는 중...</div>}
      {data && (
        <>
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">전체 요약</h2>
            <p className="mt-2">{data.summary.conclusion}</p>
            <p className="mt-2 text-sm text-slate-600">
              신뢰도 점수: {data.meta.trustScore}/100 · 요약 신뢰도: {data.summary.confidence}/100
            </p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              <div>
                <h3 className="font-semibold">장점 TOP3</h3>
                <ul className="list-disc pl-5">{data.summary.pros.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
              <div>
                <h3 className="font-semibold">단점 TOP3</h3>
                <ul className="list-disc pl-5">{data.summary.cons.map((c) => <li key={c}>{c}</li>)}</ul>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h3 className="font-semibold">키워드/토픽</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {data.summary.keywords.map((keyword) => (
                <span key={keyword} className="rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                  {keyword}
                </span>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            {data.sources.map((item) => (
              <article key={item.url} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{item.sourceName} · {item.sourceDomain}</span>
                  <span>{item.publishedAt?.slice(0, 10) ?? '날짜 미상'}</span>
                </div>
                <h4 className="mt-2 text-lg font-semibold">{item.title ?? item.url}</h4>
                <p className="mt-1 text-slate-700">{item.snippet}</p>
                <a className="mt-2 inline-block text-sm text-blue-600 underline" href={item.url} target="_blank">
                  원문 보기
                </a>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
