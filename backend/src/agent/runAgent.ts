import { openai } from "../openai.js";
import { getMcpClient } from "../mcp/client.js";

type Message = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  tool_call_id?: string;
};

export async function runAgent(history: Message[]) {
  const tools = [
    {
      type: "function" as const,
      function: {
        name: "search-recipes",
        description:
          "Search or list recipes. Use 'query' to filter by name, description, or tag; omit or leave empty to list all recipes.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search term (optional; omit to list all)" },
          },
          required: [],
        },
      },
    },
    {
      type: "function" as const,
      function: {
        name: "create-recipe",
        description: "Create a new recipe",
        parameters: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            ingredients: { type: "array", items: { type: "string" } },
            instructions: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
          },
          required: ["name"],
        },
      },
    },
  ];

  const messages: any[] = [
    {
      role: "system",
      content:
        "You are a helpful cooking assistant. Use tools when useful. Keep answers concise.",
    },
    ...history,
  ];

  let finalReply = "Sorry, I couldn't generate a response.";

  for (let step = 0; step < 3; step++) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      tools,
      tool_choice: "auto",
    });

    const msg = completion.choices[0].message;

    // Resposta final
    if (!msg.tool_calls || msg.tool_calls.length === 0) {
      finalReply = msg.content ?? finalReply;
      break;
    }

    // Modelo pediu tools
    messages.push(msg);

    const mcpClient = await getMcpClient();

    for (const call of msg.tool_calls) {
      if (call.type !== "function") continue;

      const args = JSON.parse(call.function.arguments || "{}");

      const mcpResult = await mcpClient.callTool({
        name: call.function.name,
        arguments: args,
      });

      const content = mcpResult.content;
      const text =
        Array.isArray(content) &&
        content.length > 0 &&
        content[0].type === "text"
          ? content[0].text
          : JSON.stringify(mcpResult);

      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: text,
      });
    }
  }

  return finalReply;
}
