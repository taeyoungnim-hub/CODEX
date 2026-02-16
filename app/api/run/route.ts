import { NextRequest } from "next/server";
import { providers } from "@/lib/providers";
import { providerOrder } from "@/lib/data/presets";
import { ProviderId, StandardMessage } from "@/lib/types";
import { critiquePrompt, revisedPrompt, synthesisPrompt } from "@/lib/workflows/prompts";

async function collect(
  providerId: ProviderId,
  messages: StandardMessage[],
  apiKey: string | undefined,
  model: string,
  temperature: number,
  maxTokens: number
) {
  let text = "";
  for await (const chunk of providers[providerId].sendMessage(
    { messages, model, temperature, maxTokens, stream: true },
    apiKey
  )) {
    if (chunk.type === "token") text += chunk.token ?? "";
    if (chunk.type === "error") throw new Error(chunk.error);
  }
  return text;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { prompt, apiKeys, models, temperature, maxTokens } = body as {
    prompt: string;
    apiKeys: Partial<Record<ProviderId, string>>;
    models: Record<ProviderId, string>;
    temperature: number;
    maxTokens: number;
  };

  const answers = {} as Record<ProviderId, string>;
  await Promise.all(
    providerOrder.map(async (id) => {
      answers[id] = await collect(id, [{ role: "user", content: prompt }], apiKeys[id], models[id], temperature, maxTokens);
    })
  );

  const critiques = {} as Record<ProviderId, string>;
  await Promise.all(
    providerOrder.map(async (id) => {
      critiques[id] = await collect(id, critiquePrompt(prompt, answers, id), apiKeys[id], models[id], temperature, maxTokens);
    })
  );

  const revised = {} as Record<ProviderId, string>;
  await Promise.all(
    providerOrder.map(async (id) => {
      revised[id] = await collect(id, revisedPrompt(prompt, answers[id], critiques[id]), apiKeys[id], models[id], temperature, maxTokens);
    })
  );

  const finalSynthesis = await collect(
    "openai",
    synthesisPrompt(prompt, revised),
    apiKeys.openai,
    models.openai,
    temperature,
    maxTokens
  );

  return Response.json({ answers, critiques, revised, finalSynthesis });
}
