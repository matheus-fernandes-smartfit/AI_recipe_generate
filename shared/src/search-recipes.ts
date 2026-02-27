import { z } from "zod";

export const SearchRecipesInputSchema = z.object({
  query: z.string().optional().default(""),
});

export type SearchRecipesInput = z.infer<typeof SearchRecipesInputSchema>;
