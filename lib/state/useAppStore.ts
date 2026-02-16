"use client";

import { create } from "zustand";
import { providerLabel, providerOrder, presetConfig, presetModelMap } from "@/lib/data/presets";
import { AppMode, Preset, ProviderId, ProviderState } from "@/lib/types";

interface AppState {
  preset: Preset;
  mode: AppMode;
  darkMode: boolean;
  prompt: string;
  finalSynthesis: string;
  apiKeys: Partial<Record<ProviderId, string>>;
  providers: Record<ProviderId, ProviderState>;
  setPrompt: (v: string) => void;
  setPreset: (preset: Preset) => void;
  setMode: (mode: AppMode) => void;
  setApiKey: (providerId: ProviderId, key: string) => void;
  setProviderPatch: (providerId: ProviderId, patch: Partial<ProviderState>) => void;
  setFinalSynthesis: (value: string) => void;
  toggleDarkMode: () => void;
  hydrate: () => void;
  persist: () => void;
}

const initProviders = (preset: Preset): Record<ProviderId, ProviderState> => {
  return providerOrder.reduce((acc, providerId) => {
    acc[providerId] = {
      providerId,
      model: presetModelMap[preset][providerId],
      status: "idle",
      answer: "",
      critique: "",
      revised: "",
      history: []
    };
    return acc;
  }, {} as Record<ProviderId, ProviderState>);
};

export const useAppStore = create<AppState>((set, get) => ({
  preset: "balanced",
  mode: "single",
  darkMode: false,
  prompt: "",
  finalSynthesis: "",
  apiKeys: {},
  providers: initProviders("balanced"),
  setPrompt: (prompt) => set({ prompt }),
  setPreset: (preset) =>
    set((state) => ({
      preset,
      providers: providerOrder.reduce((acc, id) => {
        acc[id] = { ...state.providers[id], model: presetModelMap[preset][id] };
        return acc;
      }, {} as Record<ProviderId, ProviderState>)
    })),
  setMode: (mode) => set({ mode }),
  setApiKey: (providerId, key) => set((s) => ({ apiKeys: { ...s.apiKeys, [providerId]: key } })),
  setProviderPatch: (providerId, patch) =>
    set((state) => ({ providers: { ...state.providers, [providerId]: { ...state.providers[providerId], ...patch } } })),
  setFinalSynthesis: (finalSynthesis) => set({ finalSynthesis }),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  hydrate: () => {
    const raw = localStorage.getItem("polyai-panel-state");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      set({ ...get(), ...parsed });
    } catch {
      // ignore broken local storage
    }
  },
  persist: () => {
    const { preset, mode, darkMode, prompt, finalSynthesis, apiKeys, providers } = get();
    localStorage.setItem(
      "polyai-panel-state",
      JSON.stringify({ preset, mode, darkMode, prompt, finalSynthesis, apiKeys, providers })
    );
  }
}));

export { providerLabel, providerOrder, presetConfig, presetModelMap };
