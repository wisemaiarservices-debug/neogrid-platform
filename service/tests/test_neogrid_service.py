from fastapi.middleware.cors import CORSMiddleware
import pytest

from service.main import (
    ALLOWED_DEV_ORIGINS,
    EnergyState,
    app,
    energy_summary,
    forecast_energy,
    input_provenance,
    optimize_energy,
    recommend_energy,
)


def test_empty_inputs_do_not_create_synthetic_site_or_measurements():
    state = EnergyState()
    provenance = input_provenance(state)
    assert state.site_id is None
    assert state.solar_kw is None
    assert provenance["data_mode"] == "insufficient_inputs"
    assert provenance["defaulted_fields"] == []
    assert provenance["synthetic_defaults_present"] is False
    assert "solar_kw" in provenance["missing_fields"]


def test_caller_inputs_remain_unverified_without_filling_other_fields():
    state = EnergyState(solar_kw=12.0)
    provenance = input_provenance(state)
    assert provenance["data_mode"] == "caller_supplied_unverified"
    assert "solar_kw" in provenance["provided_fields"]
    assert "load_kw" in provenance["missing_fields"]
    assert state.load_kw is None


def test_empty_energy_summary_withholds_derived_ratio():
    result = energy_summary(EnergyState())
    assert result["site_id"] is None
    assert all(item["value"] is None for item in result["kpis"])
    assert result["derived_arithmetic"]["solar_to_reported_demand_ratio_pct"] is None


def test_energy_summary_labels_arithmetic_as_unverified_input_ratio():
    result = energy_summary(EnergyState(solar_kw=20, load_kw=40, irrigation_load_kw=10))
    assert result["derived_arithmetic"]["solar_to_reported_demand_ratio_pct"] == pytest.approx(40.0)
    assert "not a verified renewable share" in result["derived_arithmetic"]["interpretation"]
    assert result["input_provenance"]["data_mode"] == "caller_supplied_unverified"


def test_forecast_is_not_fabricated():
    result = forecast_energy(EnergyState(temperature_c=39, solar_kw=50))
    assert result["status"] == "not_assessed"
    assert result["forecast"] is None
    assert result["methodology"]["calibrated_model"] is False


def test_optimizer_withholds_unverified_actions_and_impacts():
    result = optimize_energy(EnergyState())
    assert result["status"] == "not_estimable_from_available_inputs"
    assert result["plan"] is None
    assert result["actions"] == []
    assert result["expected_grid_import_reduction_kwh"] is None
    assert result["expected_carbon_reduction_kg"] is None


def test_recommendation_is_review_only_without_confidence_or_impact_claims():
    rec = recommend_energy(EnergyState()).model_dump()
    assert rec["status"] == "review_required"
    assert rec["confidence"] is None
    assert rec["requires_operator_review"] is True
    assert rec["expected_impact"]["carbon_reduction_kg"] is None


def test_energy_input_bounds_and_extra_fields_are_rejected():
    with pytest.raises(ValueError):
        EnergyState(battery_soc_pct=140)
    with pytest.raises(ValueError):
        EnergyState(unexpected_input=1)


def test_cors_allows_neogrid_web_dev_origin():
    cors_middleware = [middleware for middleware in app.user_middleware if middleware.cls is CORSMiddleware]
    assert cors_middleware
    assert "http://localhost:8504" in ALLOWED_DEV_ORIGINS
    assert "http://localhost:8504" in cors_middleware[0].kwargs["allow_origins"]
