# Recipe Collection with AI Assistant

A recipe collection app where users can save recipes and chat with an AI assistant that helps search and create recipes using natural language. Built as a full-stack monorepo with a React Native (Expo) app, Node.js API, PostgreSQL + Prisma, and an MCP server for LLM tool calling.

## Tech Stack

| Layer    | Choice                          |
|----------|----------------------------------|
| Mobile   | React Native, Expo, React Navigation |
| Backend  | Node.js, TypeScript, Express   |
| Database | PostgreSQL, Prisma              |
| MCP      | @modelcontextprotocol/sdk       |
| LLM      | OpenAI (tool calling)           |

## Monorepo Structure

```
recipe-ai/
├── app/          # React Native (Expo) mobile app
├── backend/      # Node.js API + MCP server
├── shared/       # Shared TypeScript types and Zod schemas
├── docker-compose.yml
└── package.json  # Yarn workspaces
```

- **app/** — Recipe list screen, recipe detail, add-recipe form, and Chat screen with the AI assistant.
- **backend/** — REST API (recipes CRUD, chat endpoint), Prisma models (Recipe, Conversation, Message), and MCP server with `search-recipes` and `create-recipe` tools.
- **shared/** — Shared types and Zod schemas used by both app and backend.

## Prerequisites

- Node.js 20+
- Yarn (or npm)
- Docker and Docker Compose (for PostgreSQL)
- OpenAI API key

## Setup Instructions

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd recipe-ai
yarn install
```

### 2. Run the database

Start PostgreSQL with Docker Compose:

```bash
docker-compose up -d
```

This starts Postgres on `localhost:5432` with database `recipe_ai`, user `postgres`, password `postgres`.

### 3. Backend: environment and database

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and set:

- `DATABASE_URL` — already set for local Docker (see `.env.example`).
- `OPENAI_API_KEY` — your OpenAI API key.

Generate the Prisma client and run migrations:

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

Start the API server:

```bash
yarn dev
```

The API runs at **http://localhost:3001**.

(Optional) To run the MCP server (e.g. for external tool use):

```bash
yarn mcp
```

### 4. Shared package

From the repo root, build the shared package so the app and backend can use it:

```bash
cd shared
yarn build
cd ..
```

### 5. Run the app

From the repo root:

```bash
cd app
yarn start
```

Then open the project in Expo Go (scan QR code) or run:

- `yarn ios` — iOS simulator  
- `yarn android` — Android emulator  

The app is configured to call the backend at **http://localhost:3001**. On a physical device, use your machine’s LAN IP or a tunnel (e.g. Expo’s tunnel) and set the API base URL in `app/api/config.ts` if needed.

## How to Run (Quick Reference)

1. **Database:** `docker-compose up -d`
2. **Backend:** `cd backend && cp .env.example .env` (set `OPENAI_API_KEY`), then `npx prisma migrate dev` and `yarn dev`
3. **Shared:** `cd shared && yarn build`
4. **App:** `cd app && yarn start`

