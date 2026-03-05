import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { CreateRecipeInputSchema, SearchRecipesInputSchema } from "shared";
import { prisma } from "../prisma.js";

/** Cria e configura um MCP server (handlers de tools). Usado pelo stdio e pelo cliente in-memory. */
export function createMcpServer() {
  const server = new Server(
    { name: "recipe-ai-mcp", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "create-recipe",
          description: "Create a new recipe in the database",
          inputSchema: CreateRecipeInputSchema,
        },
        {
          name: "search-recipes",
          description:
            "Search or list recipes. Use 'query' to filter; omit to list all.",
          inputSchema: SearchRecipesInputSchema,
        },
      ],
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (req) => {
    const { name, arguments: args } = req.params;

    if (name === "create-recipe") {
      const input = CreateRecipeInputSchema.parse(args);

      const recipe = await prisma.recipe.create({
        data: {
          name: input.name,
          description: input.description ?? "",
          ingredients: input.ingredients ?? [],
          instructions: input.instructions ?? "",
          tags: input.tags ?? [],
        },
      });

      const payload = {
        ok: true,
        id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        createdAt: recipe.createdAt.toISOString(),
      };
      return {
        content: [{ type: "text", text: JSON.stringify(payload) }],
      };
    }

    if (name === "search-recipes") {
      const input = SearchRecipesInputSchema.parse(args);
      const query = (input.query ?? "").trim();

      const recipes = await prisma.recipe.findMany({
        ...(query
          ? {
              where: {
                OR: [
                  { name: { contains: query, mode: "insensitive" } },
                  { description: { contains: query, mode: "insensitive" } },
                  { tags: { has: query } },
                ],
              },
            }
          : {}),
        take: 20,
        orderBy: { createdAt: "desc" },
      });

      const payload = {
        count: recipes.length,
        recipes: recipes.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          ingredients: r.ingredients,
          instructions: r.instructions,
          tags: r.tags,
          createdAt: r.createdAt.toISOString(),
        })),
      };
      return {
        content: [{ type: "text", text: JSON.stringify(payload) }],
      };
    }

    return {
      content: [{ type: "text", text: `Unknown tool: ${name}` }],
    };
  });

  return server;
}

/** Conecta o server a um transport (stdio para CLI, in-memory para o backend). */
export async function connectMcpServer(transport: Transport) {
  const server = createMcpServer();
  await server.connect(transport);
  return server;
}
