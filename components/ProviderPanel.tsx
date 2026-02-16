"use client";

import { useState } from "react";
import { ProviderState, RoundType } from "@/lib/types";

interface Props {
  name: string;
  state: ProviderState;
  onModelChange: (model: string) => void;
  mode: "single" | "multi";
  onPanelPrompt: (text: string) => void;
}

export function ProviderPanel({ name, state, onModelChange, mode, onPanelPrompt }: Props) {
  const [tab, setTab] = useState<RoundType>("answer");
  const panelText = tab === "answer" ? state.answer : tab === "critique" ? state.critique : tab === "revised" ? state.revised : state.meta || "";

  return (
    <section className="w-[350px] shrink-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="mb-2 flex items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-xs text-slate-500">{state.status}</p>
        </div>
        <input value={state.model} onChange={(e) => onModelChange(e.target.value)} className="w-36 rounded border px-2 py-1 text-xs dark:bg-slate-950" />
      </header>
      <div className="mb-2 flex gap-1 text-xs">
        {(["answer", "critique", "revised", "meta"] as RoundType[]).map((candidate) => (
          <button key={candidate} className={`rounded px-2 py-1 ${tab === candidate ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-700"}`} onClick={() => setTab(candidate)}>
            {candidate}
          </button>
        ))}
      </div>
      <div className="h-72 overflow-y-auto whitespace-pre-wrap rounded border bg-slate-50 p-2 text-sm dark:border-slate-700 dark:bg-slate-950">{panelText || "대기 중..."}</div>
      {mode === "multi" && <textarea onBlur={(e) => onPanelPrompt(e.target.value)} placeholder="패널별 입력" className="mt-2 h-20 w-full rounded border p-2 text-sm dark:bg-slate-950" />}
    </section>
  );
}
