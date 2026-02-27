import { z } from "zod";
export declare const ChatRequestSchema: z.ZodObject<{
    message: z.ZodString;
    conversationId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
