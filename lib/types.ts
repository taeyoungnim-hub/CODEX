export type ProviderId = "openai" | "gemini" | "anthropic" | "deepseek" | "grok" | "perplexity";
export type Preset = "simple" | "balanced" | "deep";
export type AppMode = "single" | "multi";
export type RoundType = "answer" | "critique" | "revised" | "meta";

export interface StandardMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface SendMessageInput {
  messages: StandardMessage[];
  model: string;
  temperature: number;
  maxTokens: number;
  stream?: boolean;
  metadata?: Record<string, string>;
}

export interface LlmChunk {
  type: "token" | "done" | "error";
  token?: string;
  error?: string;
}

export interface ProviderAdapter {
  id: ProviderId;
  displayName: string;
  sendMessage(input: SendMessageInput, apiKey?: string): AsyncIterable<LlmChunk>;
}

export interface ProviderState {
  providerId: ProviderId;
  model: string;
  status: "idle" | "needs_key" | "streaming" | "done" | "error";
  error?: string;
  answer: string;
  critique: string;
  revised: string;
  meta?: string;
  history: StandardMessage[];
}

export interface DeepResearchResult {
  byProvider: Record<ProviderId, { answer: string; critique: string; revised: string }>;
  finalSynthesis: string;
}
