"use client";

import { providerOrder, providerLabel } from "@/lib/data/presets";
import { ProviderId } from "@/lib/types";

export function SettingsModal({
  open,
  keys,
  onClose,
  onChange
}: {
  open: boolean;
  keys: Partial<Record<ProviderId, string>>;
  onClose: () => void;
  onChange: (provider: ProviderId, key: string) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-4 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">API Keys</h2>
          <button onClick={onClose}>닫기</button>
        </div>
        <div className="space-y-2">
          {providerOrder.map((id) => (
            <label key={id} className="block">
              <span className="mb-1 block text-sm">{providerLabel[id]}</span>
              <input type="password" value={keys[id] || ""} onChange={(e) => onChange(id, e.target.value)} className="w-full rounded border px-2 py-1 dark:bg-slate-950" />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
