export type Tone = "default" | "success" | "warning" | "danger" | "info";

export const apiEndpoints = [
  "/health",
  "/api/v1/dashboard/summary",
  "/api/v1/forecasts/run",
  "/api/v1/optimization/run",
  "/api/v1/recommendations/run",
];

export const kpis = [
  { label: "Grid Health", value: "98.4", unit: "%", trend: "up" as const, delta: "+0.3 24h", tone: "success" as Tone },
  { label: "System Uptime", value: "99.982", unit: "%", trend: "flat" as const, delta: "30d SLA", tone: "default" as Tone },
  { label: "Solar Production", value: "4,128", unit: "MW", trend: "up" as const, delta: "+312 vs fcst", tone: "success" as Tone },
  { label: "Demand", value: "3,946", unit: "MW", trend: "up" as const, delta: "+1.8%", tone: "default" as Tone },
  { label: "Battery SoC", value: "76", unit: "%", trend: "down" as const, delta: "-4 1h", tone: "info" as Tone },
  { label: "Carbon Avoided", value: "1,284", unit: "tCO2e", trend: "up" as const, delta: "today", tone: "success" as Tone },
];

export const hourlyEnergy = [
  { h: "00", solar: 0, wind: 86, demand: 378, battery: 118 },
  { h: "02", solar: 0, wind: 104, demand: 354, battery: 92 },
  { h: "04", solar: 0, wind: 117, demand: 336, battery: 78 },
  { h: "06", solar: 62, wind: 128, demand: 410, battery: 48 },
  { h: "08", solar: 214, wind: 143, demand: 492, battery: -26 },
  { h: "10", solar: 352, wind: 139, demand: 548, battery: -108 },
  { h: "12", solar: 420, wind: 121, demand: 560, battery: -162 },
  { h: "14", solar: 394, wind: 98, demand: 584, battery: -132 },
  { h: "16", solar: 286, wind: 86, demand: 694, battery: 122 },
  { h: "18", solar: 118, wind: 92, demand: 762, battery: 178 },
  { h: "20", solar: 14, wind: 104, demand: 708, battery: 164 },
  { h: "22", solar: 0, wind: 112, demand: 522, battery: 86 },
];

export const generationMix = [
  { name: "Solar", v: 48, color: "var(--warning)" },
  { name: "Wind", v: 22, color: "var(--info)" },
  { name: "Storage", v: 18, color: "var(--primary)" },
  { name: "Grid", v: 12, color: "var(--muted-foreground)" },
];

export const recommendations = [
  {
    id: "NGRID-REC-101",
    tag: "PEAK SHAVING",
    title: "Discharge BS-01 at 17:45",
    impact: "$48.2k avoided peak cost",
    confidence: 94,
    endpoint: "/api/v1/recommendations/run",
  },
  {
    id: "NGRID-REC-102",
    tag: "LOAD BALANCE",
    title: "Reroute 220 MW via Cascade Hub",
    impact: "-12% transmission loss",
    confidence: 88,
    endpoint: "/api/v1/optimization/run",
  },
  {
    id: "NGRID-REC-103",
    tag: "STORAGE",
    title: "Pre-charge BS-02 to 92% by 14:00",
    impact: "+6h battery reserve",
    confidence: 91,
    endpoint: "/api/v1/optimization/run",
  },
  {
    id: "NGRID-REC-104",
    tag: "CARBON",
    title: "Limit imports during 410 gCO2/kWh window",
    impact: "-6.8 kg CO2e",
    confidence: 84,
    endpoint: "/api/v1/forecasts/run",
  },
];

export const alerts = [
  { sev: "warning", asset: "SF-03 / Ivanpah West", msg: "Inverter string IV-12 underperforming (-8.2%)", t: "2m" },
  { sev: "info", asset: "BS-01 / Moss Landing", msg: "NOVA recommends 14:30 discharge window", t: "6m" },
  { sev: "warning", asset: "WF-02 / Tehachapi Ridge", msg: "Turbine T-04 offline, curtailment active", t: "11m" },
  { sev: "info", asset: "Cascade Hub", msg: "Demand forecast revised +4.1% for evening peak", t: "18m" },
  { sev: "success", asset: "BS-03 / Gateway BESS", msg: "Cell balancing complete, capacity restored", t: "32m" },
];

export const assets = [
  ["SS-01", "Cascade Hub", "Substation", "1,184 MW", "1,400 MW", "online"],
  ["SS-02", "Pinecrest 500kV", "Substation", "942 MW", "1,100 MW", "online"],
  ["BS-01", "Moss Landing", "Battery", "684 MW", "730 MW", "online"],
  ["SF-02", "Topaz Field", "Solar", "298 MW", "312 MW", "online"],
  ["SF-01", "Mojave Solar A", "Solar", "232 MW", "248 MW", "online"],
  ["BS-02", "Crimson Storage", "Battery", "318 MW", "350 MW", "online"],
  ["SF-03", "Ivanpah West", "Solar", "168 MW", "184 MW", "warning"],
] as const;

export const substations = [
  ["SS-01", "Cascade Hub", "500 kV", "1,184 MW", "online"],
  ["SS-02", "Pinecrest 500kV", "500 kV", "942 MW", "online"],
  ["SS-03", "Olympic Tie", "230 kV", "612 MW", "online"],
  ["SS-04", "Sierra North", "230 kV", "0 MW", "offline"],
  ["SS-05", "Diablo Junction", "115 kV", "284 MW", "warning"],
] as const;

export const batteryFleet = [
  { id: "BS-01", name: "Moss Landing", soc: 76, power: "684 MW", reserve: "4.8h", status: "online" },
  { id: "BS-02", name: "Crimson Storage", soc: 82, power: "318 MW", reserve: "6.1h", status: "online" },
  { id: "BS-03", name: "Gateway BESS", soc: 63, power: "230 MW", reserve: "3.9h", status: "warning" },
];

export const forecastRows = [
  { window: "Next 24h", peak: "762 MW", renewable: "88%", risk: "Evening peak", action: "Reserve 15% headroom" },
  { window: "7 days", peak: "804 MW", renewable: "84%", risk: "Heat derate", action: "Pre-charge before heat peak" },
  { window: "30 days", peak: "841 MW", renewable: "82%", risk: "Maintenance overlap", action: "Stagger inverter service" },
];

export const impact = {
  gridImportReductionKwh: 12.4,
  carbonReductionKg: 6.8,
  selfConsumptionGainPct: 9,
  reservePct: 45,
};
