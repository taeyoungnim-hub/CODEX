import { Preset, ProviderId } from "@/lib/types";

export const providerOrder: ProviderId[] = ["openai", "gemini", "anthropic", "deepseek", "grok", "perplexity"];

export const providerLabel: Record<ProviderId, string> = {
  openai: "ChatGPT",
  gemini: "Gemini",
  anthropic: "Claude Code",
  deepseek: "DeepSeek",
  grok: "Grok",
  perplexity: "Perplexity"
};

export const presetConfig = {
  simple: { temperature: 0.7, maxTokens: 500 },
  balanced: { temperature: 0.5, maxTokens: 900 },
  deep: { temperature: 0.25, maxTokens: 1800 }
} as const;

export const presetModelMap: Record<Preset, Record<ProviderId, string>> = {
  simple: {
    openai: "gpt-4.1-mini",
    gemini: "gemini-2.0-flash",
    anthropic: "claude-3-5-haiku-latest",
    deepseek: "deepseek-chat",
    grok: "grok-2-mini",
    perplexity: "sonar"
  },
  balanced: {
    openai: "gpt-4.1",
    gemini: "gemini-2.0-pro",
    anthropic: "claude-3-5-sonnet-latest",
    deepseek: "deepseek-reasoner",
    grok: "grok-2",
    perplexity: "sonar-pro"
  },
  deep: {
    openai: "gpt-4.1",
    gemini: "gemini-1.5-pro",
    anthropic: "claude-3-7-sonnet-latest",
    deepseek: "deepseek-reasoner",
    grok: "grok-2",
    perplexity: "sonar-reasoning-pro"
  }
};
