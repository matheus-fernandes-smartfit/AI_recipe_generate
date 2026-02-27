import { Router } from "express";
import { CreateRecipeInputSchema } from "shared";
import { prisma } from "../prisma.js";

export const recipesRouter = Router();

recipesRouter.get("/", async (_req, res) => {
  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(recipes);
});

recipesRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  if (!recipe) {
    return res.status(404).json({ error: "Recipe not found" });
  }

  res.json(recipe);
});

recipesRouter.post("/", async (req, res) => {
  const parsed = CreateRecipeInputSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request body",
      details: parsed.error.flatten(),
    });
  }

  const data = parsed.data;

  const created = await prisma.recipe.create({
    data: {
      name: data.name,
      description: data.description ?? "",
      ingredients: data.ingredients ?? [],
      instructions: data.instructions ?? "",
      tags: data.tags ?? [],
    },
  });

  res.status(201).json(created);
});
