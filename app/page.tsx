"use client";

import { useEffect, useRef, useState } from "react";
import { ProviderPanel } from "@/components/ProviderPanel";
import { SettingsModal } from "@/components/SettingsModal";
import { SopModal } from "@/components/SopModal";
import { TopBar } from "@/components/TopBar";
import { providerOrder, providerLabel, presetConfig } from "@/lib/state/useAppStore";
import { ProviderId } from "@/lib/types";
import { useAppStore } from "@/lib/state/useAppStore";

export default function HomePage() {
  const store = useAppStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sopOpen, setSopOpen] = useState(false);
  const abortMap = useRef<Map<ProviderId, AbortController>>(new Map());

  useEffect(() => {
    store.hydrate();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", store.darkMode);
    store.persist();
  }, [store.darkMode, store.prompt, store.mode, store.preset, store.finalSynthesis, store.providers, store.apiKeys]);

  const runSingleRound = async (providerId: ProviderId, prompt: string, target: "answer" | "critique" | "revised") => {
    const key = store.apiKeys[providerId];
    if (!key && providerId === "openai") {
      store.setProviderPatch(providerId, { status: "needs_key", error: "API 키 필요" });
      return;
    }

    const controller = new AbortController();
    abortMap.current.set(providerId, controller);
    store.setProviderPatch(providerId, { status: "streaming", [target]: "", error: "" });

    const response = await fetch("/api/stream", {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        providerId,
        apiKey: key,
        input: {
          messages: [{ role: "user", content: prompt }],
          model: store.providers[providerId].model,
          temperature: presetConfig[store.preset].temperature,
          maxTokens: presetConfig[store.preset].maxTokens,
          stream: true
        }
      })
    });

    if (!response.ok || !response.body) {
      store.setProviderPatch(providerId, { status: "error", error: `HTTP ${response.status}` });
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.trim()) continue;
        const chunk = JSON.parse(line);
        if (chunk.type === "token") {
          const next = `${store.providers[providerId][target]}${chunk.token ?? ""}`;
          store.setProviderPatch(providerId, { [target]: next });
        }
        if (chunk.type === "error") {
          store.setProviderPatch(providerId, { status: "error", error: chunk.error });
        }
      }
    }

    store.setProviderPatch(providerId, { status: "done" });
  };

  const onRun = async () => {
    store.setFinalSynthesis("");

    if (store.preset !== "deep") {
      await Promise.allSettled(providerOrder.map((id) => runSingleRound(id, store.prompt, "answer")));
      return;
    }

    const response = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: store.prompt,
        apiKeys: store.apiKeys,
        models: Object.fromEntries(providerOrder.map((id) => [id, store.providers[id].model])),
        temperature: presetConfig[store.preset].temperature,
        maxTokens: presetConfig[store.preset].maxTokens
      })
    });

    if (!response.ok) return;
    const data = await response.json();
    providerOrder.forEach((id) => {
      store.setProviderPatch(id, {
        answer: data.answers[id] || "",
        critique: data.critiques[id] || "",
        revised: data.revised[id] || "",
        status: "done"
      });
    });
    store.setFinalSynthesis(data.finalSynthesis || "");
  };

  const onStop = () => {
    abortMap.current.forEach((ctl) => ctl.abort());
    abortMap.current.clear();
  };

  return (
    <main>
      <TopBar
        preset={store.preset}
        mode={store.mode}
        onPreset={store.setPreset}
        onMode={store.setMode}
        onRun={onRun}
        onStop={onStop}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenSop={() => setSopOpen(true)}
        onToggleTheme={store.toggleDarkMode}
      />
      <section className="p-3">
        <textarea
          value={store.prompt}
          onChange={(e) => store.setPrompt(e.target.value)}
          className="h-28 w-full rounded-xl border p-3 dark:bg-slate-900"
          placeholder="질문 또는 SOP 템플릿을 입력하세요"
        />
      </section>

      {store.finalSynthesis && (
        <section className="mx-3 rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950">
          <h2 className="mb-2 font-semibold">Final Synthesis (ChatGPT)</h2>
          <pre className="whitespace-pre-wrap text-sm">{store.finalSynthesis}</pre>
        </section>
      )}

      <section className="flex gap-3 overflow-x-auto p-3">
        {providerOrder.map((providerId) => (
          <ProviderPanel
            key={providerId}
            name={providerLabel[providerId]}
            state={store.providers[providerId]}
            mode={store.mode}
            onPanelPrompt={(value) => {
              if (value.trim()) runSingleRound(providerId, value, "answer");
            }}
            onModelChange={(model) => store.setProviderPatch(providerId, { model })}
          />
        ))}
      </section>

      <SettingsModal
        open={settingsOpen}
        keys={store.apiKeys}
        onClose={() => setSettingsOpen(false)}
        onChange={(providerId, key) => store.setApiKey(providerId, key)}
      />
      <SopModal
        open={sopOpen}
        onClose={() => setSopOpen(false)}
        onPick={(content) => {
          store.setPrompt(content);
          setSopOpen(false);
        }}
      />
    </main>
  );
}
