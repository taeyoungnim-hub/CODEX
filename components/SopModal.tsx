"use client";

import { sopTemplates } from "@/lib/data/sops";

export function SopModal({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (text: string) => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white p-4 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">SOP 템플릿</h2>
          <button onClick={onClose}>닫기</button>
        </div>
        <div className="grid gap-2">
          {sopTemplates.map((sop) => (
            <button key={sop.id} onClick={() => onPick(sop.content)} className="rounded border p-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800">
              <h3 className="font-medium">{sop.title}</h3>
              <p className="mt-1 text-xs text-slate-500">클릭 시 프롬프트 입력창으로 삽입</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
