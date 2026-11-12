from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field


class EnergyState(BaseModel):
    """Input contract; defaults are synthetic demo values, never telemetry."""

    model_config = ConfigDict(extra="forbid")

    site_id: str | None = None
    solar_kw: float | None = Field(default=None, ge=0)
    battery_soc_pct: float | None = Field(default=None, ge=0, le=100)
    load_kw: float | None = Field(default=None, ge=0)
    grid_import_kw: float | None = Field(default=None, ge=0)
    carbon_intensity_gco2_kwh: float | None = Field(default=None, ge=0)
    irrigation_load_kw: float | None = Field(default=None, ge=0)
    temperature_c: float | None = Field(default=None, ge=-80, le=65)


class EnergyRecommendation(BaseModel):
    id: str
    title: str
    priority: str
    confidence: float | None = None
    explanation: str
    expected_impact: dict[str, Any]
    status: str = "review_required"
    requires_operator_review: bool = True


ALLOWED_DEV_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "NEOGRID_ALLOWED_ORIGINS",
        "http://localhost:8504,http://127.0.0.1:8504",
    ).split(",")
    if origin.strip()
]

app = FastAPI(title="NeoGrid API", version="0.2.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_DEV_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Accept", "Content-Type"],
)


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def input_provenance(state: EnergyState) -> dict[str, Any]:
    measurement_fields = set(type(state).model_fields) - {"site_id"}
    provided = sorted(state.model_fields_set)
    provided_measurements = sorted(measurement_fields.intersection(state.model_fields_set))
    missing_measurements = sorted(measurement_fields - set(provided_measurements))
    mode = "caller_supplied_unverified" if provided_measurements else "insufficient_inputs"
    return {
        "data_mode": mode,
        "provided_fields": provided,
        "provided_measurement_fields": provided_measurements,
        "defaulted_fields": [],
        "missing_fields": missing_measurements,
        "synthetic_defaults_present": False,
        "caller_supplied_values_verified": False,
        "note": (
            "No measurement defaults are populated. Caller-supplied values remain "
            "unverified until source/device identity, timestamps, units and calibration "
            "are checked."
        ),
    }

def methodology() -> dict[str, Any]:
    return {
        "type": "input_validation_and_transparent_arithmetic_only",
        "version": "neogrid-screening-v0.2",
        "calibrated_model": False,
        "trained_machine_learning": False,
        "dispatch_optimizer": False,
        "limitations": [
            "No site meter, inverter, battery BMS, tariff or grid-factor feed is connected.",
            "No time-series baseline or forecast validation dataset is available.",
            "No dispatch action or impact estimate is produced.",
            "Operator review and equipment safety constraints are mandatory.",
        ],
    }


def metadata(state: EnergyState) -> dict[str, Any]:
    return {
        "input_provenance": input_provenance(state),
        "methodology": methodology(),
        "requires_operator_review": True,
    }


def energy_summary(state: EnergyState) -> dict[str, Any]:
    ratio_inputs = (state.solar_kw, state.load_kw, state.irrigation_load_kw)
    total_demand = state.load_kw + state.irrigation_load_kw if state.load_kw is not None and state.irrigation_load_kw is not None else None
    renewable_share = round((state.solar_kw / total_demand) * 100, 1) if all(v is not None for v in ratio_inputs) and total_demand and total_demand > 0 else None
    return {
        "site_id": state.site_id,
        "scenario": "NeoGrid input screening · no assumed site or measurements",
        "kpis": [
            {"label": "Solar input", "value": state.solar_kw, "unit": "kW", "trend": "not_assessed"},
            {"label": "Battery state input", "value": state.battery_soc_pct, "unit": "%", "trend": "not_assessed"},
            {"label": "Site load input", "value": state.load_kw, "unit": "kW", "trend": "not_assessed"},
            {"label": "Grid import input", "value": state.grid_import_kw, "unit": "kW", "trend": "not_assessed"},
            {"label": "Carbon intensity input", "value": state.carbon_intensity_gco2_kwh, "unit": "gCO2/kWh", "trend": "not_assessed"},
        ],
        "derived_arithmetic": {
            "solar_to_reported_demand_ratio_pct": renewable_share,
            "interpretation": "Arithmetic ratio of supplied values only; not a verified renewable share or measured system balance.",
        },
        "generated_at": now_iso(),
        **metadata(state),
    }


def forecast_energy(state: EnergyState) -> dict[str, Any]:
    return {
        "site_id": state.site_id,
        "status": "not_assessed",
        "forecast": None,
        "reason": (
            "A validated time series, weather inputs, equipment parameters, and out-of-sample "
            "evaluation are required before NeoGrid can publish a forecast."
        ),
        "generated_at": now_iso(),
        **metadata(state),
    }


def optimize_energy(state: EnergyState) -> dict[str, Any]:
    return {
        "site_id": state.site_id,
        "status": "not_estimable_from_available_inputs",
        "plan": None,
        "actions": [],
        "expected_grid_import_reduction_kwh": None,
        "expected_carbon_reduction_kg": None,
        "expected_self_consumption_gain_pct": None,
        "reason": (
            "Dispatch planning requires synchronized meter and BMS time series, equipment "
            "limits, tariffs, grid constraints, efficiency curves and an approved objective."
        ),
        "generated_at": now_iso(),
        **metadata(state),
    }


def recommend_energy(state: EnergyState) -> EnergyRecommendation:
    return EnergyRecommendation(
        id="neogrid-review-inputs-001",
        title="Verify metered generation, load, battery and tariff inputs before dispatch planning",
        priority="review_required",
        confidence=None,
        explanation=(
            "The current input contract does not include verified time-series telemetry, "
            "battery operating limits, tariff schedules or grid constraints. No dispatch "
            "recommendation is generated from synthetic defaults or unverified values."
        ),
        expected_impact={
            "grid_import_reduction_kwh": None,
            "carbon_reduction_kg": None,
            "renewable_self_consumption_gain_pct": None,
        },
        status="review_required",
        requires_operator_review=True,
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "neogrid-api",
        "mode": "decision_support_only",
        "time": now_iso(),
    }


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
    return {
        "status": "review_required",
        "recommendations": [recommend_energy(state).model_dump()],
        "generated_at": now_iso(),
        **metadata(state),
    }
