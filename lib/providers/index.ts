import { ProviderAdapter, ProviderId } from "@/lib/types";
import { openaiProvider } from "@/lib/providers/openai";
import {
  anthropicProvider,
  deepseekProvider,
  geminiProvider,
  grokProvider,
  perplexityProvider
} from "@/lib/providers/stubs";

export const providers: Record<ProviderId, ProviderAdapter> = {
  openai: openaiProvider,
  gemini: geminiProvider,
  anthropic: anthropicProvider,
  deepseek: deepseekProvider,
  grok: grokProvider,
  perplexity: perplexityProvider
};
