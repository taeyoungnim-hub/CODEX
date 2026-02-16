import { ProviderAdapter, ProviderId } from "@/lib/types";

export class BaseStubProvider implements ProviderAdapter {
  id: ProviderId;
  displayName: string;

  constructor(id: ProviderId, displayName: string) {
    this.id = id;
    this.displayName = displayName;
  }

  async *sendMessage(): AsyncIterable<{ type: "token" | "done"; token?: string }> {
    const text = `${this.displayName} stub 응답입니다. 실제 API 키 연결 후 실제 답변을 받을 수 있습니다.`;
    for (const token of text.split(" ")) {
      await new Promise((r) => setTimeout(r, 25));
      yield { type: "token", token: `${token} ` };
    }
    yield { type: "done" };
  }
}
