import { z } from "zod";
export const RecipeSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "name is required"),
    description: z.string().default(""),
    ingredients: z.array(z.string().min(1)).default([]),
    instructions: z.string().default(""),
    tags: z.array(z.string().min(1)).default([]),
    createdAt: z.string(),
});
export const CreateRecipeInputSchema = z.object({
    name: z.string().min(1, "name is required"),
    description: z.string().optional(),
    ingredients: z.array(z.string().min(1)).optional(),
    instructions: z.string().optional(),
    tags: z.array(z.string().min(1)).optional(),
});
