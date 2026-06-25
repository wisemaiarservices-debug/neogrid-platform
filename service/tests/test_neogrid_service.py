from fastapi.middleware.cors import CORSMiddleware

from service.main import ALLOWED_DEV_ORIGINS, EnergyState, app, forecast_energy, optimize_energy, recommend_energy


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


def test_cors_allows_neogrid_web_dev_origin():
    cors_middleware = [middleware for middleware in app.user_middleware if middleware.cls is CORSMiddleware]
    assert cors_middleware
    assert "http://localhost:8504" in ALLOWED_DEV_ORIGINS
    assert "http://localhost:8504" in cors_middleware[0].kwargs["allow_origins"]
