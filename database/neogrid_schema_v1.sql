-- NeoGrid Schema v1
-- NOVA Energy module schema for NOVA OS compatibility.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS timescaledb;

CREATE TABLE IF NOT EXISTS energy_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    energy_asset_type TEXT NOT NULL,
    name TEXT NOT NULL,
    capacity_kw NUMERIC,
    capacity_kwh NUMERIC,
    manufacturer TEXT,
    model TEXT,
    status TEXT DEFAULT 'active',
    location GEOMETRY(POINT, 4326),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS solar_production_measurements (
    time TIMESTAMPTZ NOT NULL,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    energy_asset_id UUID NOT NULL REFERENCES energy_assets(id) ON DELETE CASCADE,
    production_kw NUMERIC,
    production_kwh NUMERIC,
    irradiance_wm2 NUMERIC,
    panel_temperature_c NUMERIC,
    inverter_efficiency_pct NUMERIC,
    performance_ratio NUMERIC,
    quality TEXT DEFAULT 'good',
    metadata JSONB DEFAULT '{}',
    PRIMARY KEY (time, energy_asset_id)
);

SELECT create_hypertable('solar_production_measurements', 'time', if_not_exists => TRUE);

CREATE TABLE IF NOT EXISTS battery_telemetry (
    time TIMESTAMPTZ NOT NULL,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    energy_asset_id UUID REFERENCES energy_assets(id) ON DELETE CASCADE,
    state_of_charge_pct NUMERIC,
    power_kw NUMERIC,
    temperature_c NUMERIC,
    health_pct NUMERIC,
    available_capacity_kwh NUMERIC,
    metadata JSONB DEFAULT '{}',
    PRIMARY KEY (time, site_id, energy_asset_id)
);

SELECT create_hypertable('battery_telemetry', 'time', if_not_exists => TRUE);

CREATE TABLE IF NOT EXISTS grid_flow_measurements (
    time TIMESTAMPTZ NOT NULL,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    import_kw NUMERIC,
    export_kw NUMERIC,
    import_kwh NUMERIC,
    export_kwh NUMERIC,
    carbon_intensity_gco2_kwh NUMERIC,
    price_per_kwh NUMERIC,
    metadata JSONB DEFAULT '{}',
    PRIMARY KEY (time, site_id)
);

SELECT create_hypertable('grid_flow_measurements', 'time', if_not_exists => TRUE);

CREATE TABLE IF NOT EXISTS energy_forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    forecast_type TEXT NOT NULL,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    predicted_kw NUMERIC,
    predicted_kwh NUMERIC,
    confidence NUMERIC,
    model_name TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS energy_optimization_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL,
    objective TEXT NOT NULL,
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    baseline JSONB DEFAULT '{}',
    optimized_plan JSONB DEFAULT '{}',
    expected_savings_kwh NUMERIC,
    expected_carbon_reduction_kg NUMERIC,
    confidence NUMERIC,
    status TEXT DEFAULT 'proposed',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS carbon_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    renewable_kwh NUMERIC,
    grid_import_kwh NUMERIC,
    carbon_avoided_kg NUMERIC,
    emissions_kg NUMERIC,
    renewable_share_pct NUMERIC,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);
