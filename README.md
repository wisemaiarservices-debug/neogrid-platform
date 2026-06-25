# NeoGrid Platform

NeoGrid is the NOVA Energy module of NeoHaven AI Urban Labs.

Public product name: NOVA Energy
Internal product name: NeoGrid
Parent platform: NOVA OS

## Purpose

NeoGrid monitors, forecasts, and optimizes renewable energy infrastructure.

It connects:

- Solar production
- Battery storage
- Energy consumption
- Grid import/export
- Carbon analytics
- Digital Twin
- Knowledge Graph
- AI recommendations

## Core Workflow

Observe -> Analyze -> Forecast -> Recommend -> Simulate -> Optimize -> Measure Impact

## Strategic Role

NeoGrid strengthens NeoHaven's SolarHub positioning by showing that NOVA OS is not only agrivoltaics, but a complete renewable infrastructure intelligence platform.

## Frontend App

The NeoGrid product UI lives in `apps/web`.

Run locally:

```powershell
cd apps/web
pnpm install
pnpm run typecheck
pnpm run build
pnpm run dev
```

Open:

```text
http://localhost:8504
```

The UI attempts to read the existing NeoGrid API at `VITE_NEOGRID_API_BASE` and falls back to deterministic demo data when the backend is unavailable. Supported backend endpoints:

- `/health`
- `/api/v1/dashboard/summary`
- `/api/v1/forecasts/run`
- `/api/v1/optimization/run`
- `/api/v1/recommendations/run`
