from service.main import EnergyState, forecast_energy, optimize_energy, recommend_energy


def test_forecast_heat_derate():
    result = forecast_energy(EnergyState(temperature_c=39, solar_kw=50))
    assert result["solar_derate_pct"] == 6
    assert result["expected_solar_kw"] == 47


def test_optimization_contains_actions():
    result = optimize_energy(EnergyState())
    assert result["expected_grid_import_reduction_kwh"] > 0
    assert len(result["actions"]) >= 3


def test_recommendation_operator_review():
    rec = recommend_energy(EnergyState())
    assert "battery" in rec.title.lower()
    assert rec.status == "operator_review"
    assert rec.confidence > 0.5
