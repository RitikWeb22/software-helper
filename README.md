# Software Helper

AI-powered software planning workspace with a TypeScript backend and React frontend.

It takes a problem statement and generates structured outputs across four areas:

- Product Analysis
- System Architecture
- Database Design
- Final Summary

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- AI Orchestration: LangGraph + LangChain
- Model provider integration: Groq model via LangChain adapter

## Project Structure

```text
software-helper/
  backend/
    server.ts
    src/
      app.ts
      config/model.config.ts
      services/
        ai.modelset.ts
        graph.ai.ts
  frontend/
    src/
      components/
```

## Features

- Multi-agent style output cards for architecture planning
- Markdown rendering with tables, lists, and code blocks
- Code highlighting in generated responses
- Copy-to-clipboard for generated content
- Expand/collapse result cards to fullscreen
- Local chat history saved in browser localStorage
- Hover delete support for history items

## Prerequisites

- Node.js 20+
- npm 10+

## Environment Variables

Create a .env file inside backend/:

```env
GEMINI_API_KEY=
OPENAI_API_KEY=
MISTRALAI_API_KEY=
COHERE_API_KEY=
```

Notes:

- backend/src/config/model.config.ts reads the variables above.
- Current model setup in backend/src/services/ai.modelset.ts uses OPENAI_API_KEY in code path for the configured model client.

## Installation

Install dependencies in both apps:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run Locally

Use two terminals.

Terminal 1 (backend):

```bash
cd backend
npm run dev
```

Backend runs at: http://localhost:3000

Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

Frontend runs at the Vite URL (usually http://localhost:5173).

## API

### POST /api/generate

Request body:

```json
{
  "problem": "Build a WhatsApp-like chat application"
}
```

Response shape:

```json
{
  "product_analysis": "...",
  "system_architecture": "...",
  "database_design": "...",
  "summary": "..."
}
```

## Scripts

Backend:

- npm run dev

Frontend:

- npm run dev
- npm run build
- npm run preview
- npm run lint

## Troubleshooting

- If frontend cannot fetch results, ensure backend is running on port 3000.
- If generation fails, verify API keys in backend/.env.
- If old UI history appears incorrect, clear browser localStorage for the frontend origin.

## License

ISC (as currently configured in backend/package.json)
