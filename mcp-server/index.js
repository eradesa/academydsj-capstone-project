const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");

const API = "http://localhost:5000/api/notes";

const server = new McpServer({
  name: "studymate",
  version: "1.0.0",
});

server.tool("list_notes", "List all study notes", {}, async () => {
  const res = await fetch(API);
  const notes = await res.json();
  return {
    content: [{ type: "text", text: JSON.stringify(notes, null, 2) }],
  };
});

server.tool(
  "create_note",
  "Create a new study note",
  {
    title: z.string().describe("Note title"),
    subject: z.string().describe("Subject/topic"),
    content: z.string().describe("Note content"),
  },
  async ({ title, subject, content }) => {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, subject, content }),
    });
    const note = await res.json();
    return {
      content: [{ type: "text", text: `Note created: ${note.title} (id: ${note._id})` }],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("StudyMate MCP server running on stdio");
}

main().catch(console.error);
