import { z } from "zod";
export const ChatRequestSchema = z.object({
    message: z.string().min(1, "message is required"),
    conversationId: z.string().optional(),
});
