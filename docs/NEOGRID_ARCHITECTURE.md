# NeoGrid Architecture

## High-Level Flow

```text
User
↓
NOVA Command Center
↓
NOVA Energy Module
↓
API Gateway
↓
NeoGrid Services
↓
NOVA Core Services
↓
PostgreSQL + PostGIS + TimescaleDB + Redis
↓
Solar Inverters + Batteries + Smart Meters + Weather APIs + Grid Signals + IoT
```

## Services

### Energy Asset Service

Manages solar arrays, batteries, inverters, meters, transformers, pumps, EV chargers, and grid connection points.

### Production Service

Stores and analyzes solar production data.

### Consumption Service

Stores and analyzes energy consumption and peak demand.

### Battery Service

Tracks state of charge, battery health, cycles, and optimization state.

### Grid Service

Tracks import, export, grid events, carbon intensity, tariffs, and outages.

### Forecast Service

Generates solar, demand, battery, carbon, and grid dependency forecasts.

### Recommendation Service

Creates operator-approved energy recommendations with confidence, explanation, and expected impact.

## SolarHub Demo Role

NeoGrid should support the heatwave agrivoltaic demo by forecasting solar/battery/load impact and recommending battery/pump timing.
