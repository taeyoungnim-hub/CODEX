import { ProviderAdapter, LlmChunk, SendMessageInput } from "@/lib/types";

export const openaiProvider: ProviderAdapter = {
  id: "openai",
  displayName: "ChatGPT",
  async *sendMessage(input: SendMessageInput, apiKey?: string): AsyncIterable<LlmChunk> {
    if (!apiKey) {
      yield { type: "error", error: "OpenAI API key missing" };
      return;
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: input.model,
          messages: input.messages,
          temperature: input.temperature,
          max_tokens: input.maxTokens,
          stream: input.stream ?? true
        })
      });

      if (!response.ok) {
        yield { type: "error", error: `OpenAI error (${response.status})` };
        return;
      }

      if (!response.body) {
        yield { type: "error", error: "No response body" };
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
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") {
            yield { type: "done" };
            return;
          }
          try {
            const json = JSON.parse(payload);
            const token = json.choices?.[0]?.delta?.content;
            if (token) {
              yield { type: "token", token };
            }
          } catch {
            yield { type: "error", error: "Response format error" };
            return;
          }
        }
      }
      yield { type: "done" };
    } catch {
      yield { type: "error", error: "Network error or timeout" };
    }
  }
};
