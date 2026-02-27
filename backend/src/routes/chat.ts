import { Router } from "express";
import { ChatRequestSchema } from "shared";
import { openai } from "../openai.js";
import { prisma } from "../prisma.js";
import { runAgent } from "../agent/runAgent.js";

export const chatRouter = Router();

chatRouter.post("/", async (req, res) => {
  const parsed = ChatRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request body",
      details: parsed.error.flatten(),
    });
  }

  const { message, conversationId } = parsed.data;

  // 1) Busca conversa existente (se veio id) ou cria uma nova
  const existing = conversationId
    ? await prisma.conversation.findUnique({ where: { id: conversationId } })
    : null;

  const conv = existing ?? (await prisma.conversation.create({ data: {} }));

  // 2) Persiste mensagem do usuário
  await prisma.message.create({
    data: {
      conversationId: conv.id,
      role: "user",
      content: message,
    },
  });

  // 3) Busca histórico (inclui a msg recém-criada)
  const history = await prisma.message.findMany({
    where: { conversationId: conv.id },
    orderBy: { createdAt: "asc" },
    take: 12,
  });

  const assistantReply = await runAgent(
    history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  );
  // 5) Persiste resposta do assistant
  await prisma.message.create({
    data: {
      conversationId: conv.id,
      role: "assistant",
      content: assistantReply,
    },
  });

  // 6) Retorna reply + conversationId para continuidade
  res.json({ conversationId: conv.id, reply: assistantReply });
});
