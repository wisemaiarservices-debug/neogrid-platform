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

The UI performs a dashboard-summary reachability probe using `VITE_NEOGRID_API_BASE`; it records whether the endpoint responds but does not currently consume the returned dashboard payload. When the endpoint is unavailable, the UI uses deterministic demo fixtures. The current interface is a scenario preview: fixture values are not live SCADA, grid, battery, site telemetry, measured carbon impact, or proof of connected physical assets. The endpoint list below is a contract reference only; it does not establish that routes are deployed, authenticated, tenant-isolated, or connected to providers. Physical dispatch remains disabled. Declared API contract endpoints:

- `/health`
- `/api/v1/dashboard/summary`
- `/api/v1/forecasts/run`
- `/api/v1/optimization/run`
- `/api/v1/recommendations/run`


## Web dependency security baseline

The NeoGrid web preview uses Vite `8.3.8`, React/React DOM `19.2.7`, and the committed pnpm lockfile. The pnpm overrides pin `nanoid@3` to patched `3.3.18`, PostCSS to patched `8.5.33`, `source-map-js` to `1.2.4`, Browserslist to patched `4.29.6`, and `baseline-browser-mapping` to `2.11.39`. CI runs `pnpm install --frozen-lockfile`, provenance tests, TypeScript, production and full dependency audits, and the production build. Both audits reported no known vulnerabilities on the regenerated dependency graph; final exact-head frozen-lockfile CI is the remaining check.
