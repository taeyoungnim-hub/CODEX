import { SearchBox } from '@/components/search-box';

async function fetchTrending(): Promise<string[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'}/api/trending`, {
      cache: 'no-store'
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.keywords ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const serverKeywords = await fetchTrending();

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-2 text-3xl font-bold">모두의 리뷰 (All Reviews Hub)</h1>
      <p className="mb-8 text-slate-600">검색어 1개로 리뷰 메타서치 + 출처별/전체 요약을 제공합니다.</p>
      <SearchBox serverKeywords={serverKeywords} />
    </main>
  );
}
