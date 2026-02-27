import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createMcpServer } from "./server.js";

let clientInstance: Client | null = null;
let initPromise: Promise<Client> | null = null;

/**
 * Retorna um cliente MCP já conectado ao nosso MCP server (in-memory).
 * O assistente usa este cliente para chamar search-recipes e create-recipe via MCP.
 */
export async function getMcpClient(): Promise<Client> {
  if (clientInstance) return clientInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    const server = createMcpServer();
    await server.connect(serverTransport);

    const client = new Client(
      { name: "recipe-ai-backend", version: "0.1.0" },
      { capabilities: {} },
    );
    await client.connect(clientTransport);

    clientInstance = client;
    return client;
  })();

  return initPromise;
}
