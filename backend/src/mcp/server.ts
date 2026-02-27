import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

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

      return {
        content: [{ type: "text", text: `Recipe created with id ${recipe.id}` }],
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

      const text =
        recipes.length === 0
          ? "No recipes found."
          : recipes.map((r) => `- ${r.name}: ${r.description}`).join("\n");

      return { content: [{ type: "text", text }] };
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

async function main() {
  const transport = new StdioServerTransport();
  await connectMcpServer(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
