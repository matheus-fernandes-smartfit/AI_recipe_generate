import { API_BASE_URL } from "./config";

export type ChatResponse = {
  conversationId: string;
  reply: string;
};

export async function sendChatMessage(
  message: string,
  conversationId?: string
): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, conversationId }),
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const details = json?.details ? JSON.stringify(json.details) : "";
    throw new Error(json?.error ?? `HTTP ${res.status} ${details}`);
  }

  return json;
}
