import { z } from "zod";
export declare const RecipeSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodDefault<z.ZodString>;
    ingredients: z.ZodDefault<z.ZodArray<z.ZodString>>;
    instructions: z.ZodDefault<z.ZodString>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type Recipe = z.infer<typeof RecipeSchema>;
export declare const CreateRecipeInputSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    ingredients: z.ZodOptional<z.ZodArray<z.ZodString>>;
    instructions: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type CreateRecipeInput = z.infer<typeof CreateRecipeInputSchema>;
