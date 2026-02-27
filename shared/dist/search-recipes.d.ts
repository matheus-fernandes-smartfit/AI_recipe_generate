import { z } from "zod";
export declare const SearchRecipesInputSchema: z.ZodObject<{
    query: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type SearchRecipesInput = z.infer<typeof SearchRecipesInputSchema>;
