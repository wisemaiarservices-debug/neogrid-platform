# NeoGrid Demo Service Runbook

## Purpose

This service provides the first runnable NOVA Energy / NeoGrid demo API for SolarHub.

It supports the agrivoltaic demo by forecasting solar derating, battery reserve, grid dependency, carbon impact, and irrigation-energy coordination.

## Run locally

```powershell
cd service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements-dev.txt
uvicorn main:app --reload --port 8200
```

## Verify

```text
http://localhost:8200/health
http://localhost:8200/api/v1/dashboard/summary
```

## Smoke test

From repo root:

```powershell
.\scripts\smoke-api.ps1
```

## Test

```powershell
cd service
pytest
```

## API endpoints

- `GET /health`
- `GET /api/v1/dashboard/summary`
- `POST /api/v1/forecasts/run`
- `POST /api/v1/optimization/run`
- `POST /api/v1/recommendations/run`

## Demo Story

A heatwave is forecast. Solar output may derate while irrigation energy demand rises. NeoGrid recommends charging during the morning solar peak and reserving battery capacity for the irrigation window.
