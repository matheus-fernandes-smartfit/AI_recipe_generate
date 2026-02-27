import { Router } from "express";
import { openai } from "../openai.js";

export const healthRouter = Router();

healthRouter.get("/llm-check", async (_req, res) => {
  try {
    const result = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: "Say hello in one short sentence.",
    });

    const text =
      (result.output_text as string | undefined) ?? JSON.stringify(result);

    res.json({ ok: true, text });
  } catch (err: any) {
    res.status(500).json({
      ok: false,
      error: err?.message ?? String(err),
    });
  }
});
