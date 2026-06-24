from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel, Field


class EnergyState(BaseModel):
    site_id: str = "site-solarhub-agro-001"
    solar_kw: float = 42.6
    battery_soc_pct: float = 67
    load_kw: float = 31.4
    grid_import_kw: float = 4.8
    carbon_intensity_gco2_kwh: float = 410
    irrigation_load_kw: float = 9.5
    temperature_c: float = 39


class EnergyRecommendation(BaseModel):
    id: str
    title: str
    priority: str
    confidence: float = Field(ge=0, le=1)
    explanation: str
    expected_impact: dict[str, Any]
    status: str = "operator_review"


app = FastAPI(title="NeoGrid API", version="0.1.0")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def energy_summary(state: EnergyState = EnergyState()) -> dict[str, Any]:
    renewable_share = min(100, round((state.solar_kw / max(state.load_kw + state.irrigation_load_kw, 1)) * 100, 1))
    return {
        "site_id": state.site_id,
        "scenario": "SolarHub energy optimization",
        "kpis": [
            {"label": "Solar Production", "value": state.solar_kw, "unit": "kW", "trend": "up"},
            {"label": "Battery State", "value": state.battery_soc_pct, "unit": "%", "trend": "stable"},
            {"label": "Site Load", "value": state.load_kw, "unit": "kW", "trend": "up"},
            {"label": "Grid Import", "value": state.grid_import_kw, "unit": "kW", "trend": "down"},
            {"label": "Renewable Share", "value": renewable_share, "unit": "%", "trend": "up"},
            {"label": "Carbon Intensity", "value": state.carbon_intensity_gco2_kwh, "unit": "gCO2/kWh", "trend": "down"},
        ],
        "generated_at": now_iso(),
    }


def forecast_energy(state: EnergyState) -> dict[str, Any]:
    heat_derate_pct = 6 if state.temperature_c >= 37 else 2
    irrigation_peak_risk = "high" if state.irrigation_load_kw >= 8 else "medium"
    return {
        "site_id": state.site_id,
        "solar_derate_pct": heat_derate_pct,
        "expected_solar_kw": round(state.solar_kw * (1 - heat_derate_pct / 100), 2),
        "battery_reserve_pct": max(20, state.battery_soc_pct - 18),
        "irrigation_peak_risk": irrigation_peak_risk,
        "grid_dependency_risk": "medium" if state.grid_import_kw > 0 else "low",
        "generated_at": now_iso(),
    }


def optimize_energy(state: EnergyState) -> dict[str, Any]:
    return {
        "site_id": state.site_id,
        "plan": "charge_morning_shift_irrigation_evening",
        "actions": [
            "Maintain battery reserve above 45% before irrigation window",
            "Use morning solar peak for battery charging",
            "Shift irrigation pump load to lower-carbon evening window",
            "Limit grid import during high carbon intensity periods",
        ],
        "expected_grid_import_reduction_kwh": 12.4,
        "expected_carbon_reduction_kg": 6.8,
        "expected_self_consumption_gain_pct": 9,
        "generated_at": now_iso(),
    }


def recommend_energy(state: EnergyState) -> EnergyRecommendation:
    return EnergyRecommendation(
        id="neogrid-rec-battery-irrigation-001",
        title="Coordinate battery charging with irrigation timing",
        priority="high",
        confidence=0.84,
        explanation=(
            "Heat reduces solar output while irrigation load rises. NeoGrid recommends charging during the morning solar peak "
            "and reserving battery capacity for the coordinated irrigation window."
        ),
        expected_impact={
            "grid_import_reduction_kwh": 12.4,
            "carbon_reduction_kg": 6.8,
            "renewable_self_consumption_gain_pct": 9,
            "battery_reserve_pct": 45,
        },
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "neogrid-api", "time": now_iso()}


@app.get("/api/v1/dashboard/summary")
def dashboard_summary() -> dict[str, Any]:
    state = EnergyState()
    return {
        **energy_summary(state),
        "forecast": forecast_energy(state),
        "optimization": optimize_energy(state),
        "recommendations": [recommend_energy(state).model_dump()],
    }


@app.post("/api/v1/forecasts/run")
def run_forecast(state: EnergyState) -> dict[str, Any]:
    return forecast_energy(state)


@app.post("/api/v1/optimization/run")
def run_optimization(state: EnergyState) -> dict[str, Any]:
    return optimize_energy(state)


@app.post("/api/v1/recommendations/run")
def run_recommendations(state: EnergyState) -> dict[str, Any]:
    return {"status": "completed", "recommendations": [recommend_energy(state).model_dump()], "generated_at": now_iso()}
