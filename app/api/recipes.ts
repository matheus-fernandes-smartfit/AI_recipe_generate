import { API_BASE_URL } from "./config";

export type Recipe = {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string;
  tags: string[];
  createdAt: string;
};

export type CreateRecipePayload = {
  name: string;
  description?: string;
  ingredients?: string[];
  instructions?: string;
  tags?: string[];
};

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch(`${API_BASE_URL}/recipes`);
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new Error(json?.error ?? `HTTP ${res.status}`);
  }

  return Array.isArray(json) ? json : [];
}

export async function fetchRecipe(id: string): Promise<Recipe> {
  const res = await fetch(`${API_BASE_URL}/recipes/${id}`);
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    if (res.status === 404) throw new Error("Recipe not found");
    throw new Error(json?.error ?? `HTTP ${res.status}`);
  }

  return json;
}

export async function createRecipe(payload: CreateRecipePayload): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/recipes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const details = json?.details ? JSON.stringify(json.details) : "";
    throw new Error(json?.error ?? `HTTP ${res.status} ${details}`);
  }
}
