# Realtime Chat App

This project contains:

- A React + Vite chat frontend (`chat frontend`)
- A Node.js WebSocket backend (`websocket-backend`)

Users can join a room by ID and exchange real-time messages with others in the same room.

## Project Structure

```text
.
├── chat frontend/        # React UI (Vite + TypeScript + Tailwind CSS)
└── websocket-backend/    # WebSocket server (TypeScript + ws)
```

## Tech Stack

- Frontend: React 19, Vite, TypeScript, Tailwind CSS
- Backend: Node.js, TypeScript, `ws`
- Protocol: WebSocket

## Prerequisites

- Node.js 18+ (recommended: Node.js 20+)
- npm

## Installation

Install dependencies for both apps:

```bash
cd "chat frontend"
npm install

cd ../websocket-backend
npm install
```

## Run Locally

Open two terminals.

1. Start WebSocket backend:

```bash
cd websocket-backend
npm run dev
```

Backend listens on `ws://localhost:8080`.

2. Start frontend:

```bash
cd "chat frontend"
npm run dev
```

Frontend runs on Vite dev server (usually `http://localhost:5173`).

## How It Works

1. Enter your name and room ID in the frontend.
2. Click **Join Room**.
3. Send messages.
4. Messages are broadcast only to users in the same room.

## WebSocket Message Format

Client sends JSON messages to the backend:

```json
{
  "type": "join",
  "payload": {
    "roomId": 1234
  }
}
```

```json
{
  "type": "chat",
  "payload": {
    "message": "alice: hello"
  }
}
```

## Scripts

### Frontend (`chat frontend`)

- `npm run dev` - start Vite dev server
- `npm run build` - type-check and build production assets
- `npm run lint` - run ESLint
- `npm run preview` - preview production build

### Backend (`websocket-backend`)

- `npm run dev` - compile TypeScript and run server from `dist/index.js`

## Important Notes

- Frontend currently uses a hardcoded socket URL: `ws://localhost:8080` (in `chat frontend/src/App.tsx`).
- Backend keeps room state in memory, so data is lost when the process restarts.
- No authentication or message persistence is implemented yet.

## Upload To GitHub

If this folder is not already a git repository:

```bash
git init
git add .
git commit -m "Add chat frontend + websocket backend"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

