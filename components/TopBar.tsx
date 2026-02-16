"use client";

import { AppMode, Preset } from "@/lib/types";

interface Props {
  preset: Preset;
  mode: AppMode;
  onPreset: (v: Preset) => void;
  onMode: (v: AppMode) => void;
  onRun: () => void;
  onStop: () => void;
  onOpenSettings: () => void;
  onOpenSop: () => void;
  onToggleTheme: () => void;
}

export function TopBar({ preset, mode, onPreset, onMode, onRun, onStop, onOpenSettings, onOpenSop, onToggleTheme }: Props) {
  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white/80 p-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <select value={preset} onChange={(e) => onPreset(e.target.value as Preset)} className="rounded border px-2 py-1 dark:bg-slate-900">
        <option value="simple">간단</option>
        <option value="balanced">보통</option>
        <option value="deep">심층</option>
      </select>
      <select value={mode} onChange={(e) => onMode(e.target.value as AppMode)} className="rounded border px-2 py-1 dark:bg-slate-900">
        <option value="single">Single Prompt</option>
        <option value="multi">Multi Chat Rooms</option>
      </select>
      <button onClick={onRun} className="rounded bg-blue-600 px-3 py-1 text-white">Run</button>
      <button onClick={onStop} className="rounded bg-slate-500 px-3 py-1 text-white">Stop</button>
      <button onClick={onOpenSettings} className="rounded border px-3 py-1">Settings</button>
      <button onClick={onOpenSop} className="rounded border px-3 py-1">SOP</button>
      <button onClick={onToggleTheme} className="rounded border px-3 py-1">Theme</button>
    </div>
  );
}
