# StudyMate — User Guide

## What is StudyMate?

StudyMate is a full-stack AI-powered study notes app. You can create, organize, and search study notes, get AI summaries, and access notes through Claude Desktop via an MCP server.

## Quick Start

### One command to run everything:
```bash
./start.sh
```
This starts both the server (port 5000) and client (port 5173). Open http://localhost:5173 in your browser.

### Manual setup:

**Server:**
```bash
cd server
npm install
cp .env.example .env   # Add your keys
npm start
```

**Client:**
```bash
cd client
npm install
npm run dev
```

## How to Use

### 1. Landing Page
- Open http://localhost:5173 to see the React app directly
- The landing page is in the `landing/` folder — open `landing/index.html` in a browser

### 2. Create a Note
- Fill in the **Title**, **Subject** (optional), and **Content** fields
- Click **Add Note**
- Your note appears in the grid below

### 3. Search Notes
- Use the **search box** to filter notes by title or subject
- Filtering is instant — no page reload

### 4. AI Summarize
- Click the **Summarize** button on any note
- Wait a few seconds — the AI generates:
  - 3 bullet-point summary
  - 1 quiz question with answer
- The summary is saved and persists on refresh

### 5. Delete a Note
- Click the **Delete** button on any note
- The note is removed immediately

## MCP Server (Claude Desktop)

### Setup:
Add this to your Claude Desktop config (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "studymate": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/index.js"]
    }
  }
}
```

### Available Tools:
| Tool | Description | Example |
|------|-------------|---------|
| `list_notes` | Lists all your study notes | "What notes do I have?" |
| `create_note` | Creates a new note | "Add a note about React hooks" |

### Test with MCP Inspector:
```bash
npx @modelcontextprotocol/inspector node mcp-server/index.js
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) |
| Backend | Express.js |
| Database | MongoDB Atlas |
| AI | OpenAI GPT-4o-mini |
| MCP | Model Context Protocol (stdio) |
| Landing | HTML + CSS + Vanilla JS |

## Project Structure

```
studymate/
├── landing/            # Landing page (HTML/CSS/JS)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── client/             # React app (Vite)
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── components/
│           ├── NoteForm.jsx
│           └── NoteCard.jsx
├── server/             # Express API + AI
│   ├── server.js
│   ├── .env
│   └── .env.example
├── mcp-server/         # MCP server
│   └── index.js
├── screenshots/        # App screenshots
├── start.sh            # Run everything
└── README.md
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Server won't start | Check MongoDB connection in `.env` |
| AI summarize fails | Verify `OPENAI_API_KEY` in `.env` |
| CORS error | Make sure server is running on port 5000 |
| MCP not connecting | Restart Claude Desktop after config change |
| Vite won't start | Run `npm install` in `client/` folder |

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-proj-...` |
| `PORT` | Server port | `5000` |
