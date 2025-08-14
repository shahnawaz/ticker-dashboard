# Real-Time Trading Dashboard — Next.js + NestJS

**Frontend**: Next.js (App Router) + TypeScript + Tailwind + Suspense + Recharts  
**Backend**: NestJS (REST + WebSockets) with mocked auth and in-memory caching

## Features
- **REST API** (NestJS):
  - `GET /api/tickers`
  - `GET /api/historical/:symbol`
  - `GET /api/price/:symbol`
  - `POST /api/login` (mocked, returns a fake token)
- **WebSocket** (NestJS Gateway):
  - Path: `/ws`
  - Broadcasts `{ type: "price", symbol, price, ts }` every second
- **Market Data**: Random-walk simulator + cached historical series
- **Frontend** (Next.js):
  - Live ticker list with streaming price updates
  - Real-time chart (Recharts) for selected ticker
  - Tailwind UI; app router with **Suspense** for data fetching
  - Client connects to REST + WS via env vars

## Run with Docker
```bash
docker compose up --build
```
Note: if using an older version of docker, try running:
```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend REST: http://localhost:8080/api
- Backend WS: ws://localhost:8080/ws

## Run locally (no Docker)
### Backend
```bash
cd backend
npm install
npm run start:dev
```
### Frontend
Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_BASE=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```
Then:
```bash
cd frontend
npm install
npm run dev
```

## Tests (Backend)
```bash
cd backend
npm test
```

## Assumptions
- Mock auth (no real JWT signing).
- Historical data is generated and cached in memory.
- Not production hardened; demo-quality to meet the challenge scope.
