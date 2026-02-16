import { NextRequest } from "next/server";
import { providers } from "@/lib/providers";
import { ProviderId, SendMessageInput, StandardMessage } from "@/lib/types";

interface StreamBody {
  providerId: ProviderId;
  apiKey?: string;
  input: SendMessageInput;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as StreamBody;
  const provider = providers[body.providerId];

  if (!provider) {
    return Response.json({ error: "Unknown provider" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of provider.sendMessage(body.input, body.apiKey)) {
        controller.enqueue(encoder.encode(`${JSON.stringify(chunk)}\n`));
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache"
    }
  });
}
