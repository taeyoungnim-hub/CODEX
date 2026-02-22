'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const RECENT_KEY = 'all-reviews-recent';

export function SearchBox({ serverKeywords }: { serverKeywords: string[] }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const loaded = localStorage.getItem(RECENT_KEY);
    if (loaded) setRecent(JSON.parse(loaded));
  }, []);

  const suggestions = useMemo(() => [...new Set([...recent, ...serverKeywords])].slice(0, 8), [recent, serverKeywords]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!q.trim()) return;
    const updated = [q.trim(), ...recent.filter((item) => item !== q.trim())].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    setRecent(updated);
    router.push(`/results?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        className="w-full rounded-xl border border-slate-300 px-4 py-3"
        placeholder="검색어 1개 입력 (예: 성수 파스타, 다이슨 V15)"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {suggestions.map((keyword) => (
          <button
            key={keyword}
            type="button"
            className="rounded-full bg-slate-200 px-3 py-1 text-sm"
            onClick={() => setQ(keyword)}
          >
            {keyword}
          </button>
        ))}
      </div>
      <button className="rounded-lg bg-black px-5 py-2 text-white">리뷰 모으기</button>
    </form>
  );
}
