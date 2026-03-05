import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { connectMcpServer } from "./server.js";

async function main() {
  const transport = new StdioServerTransport();
  await connectMcpServer(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
