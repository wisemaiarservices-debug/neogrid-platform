export type Tone = "default" | "success" | "warning" | "danger" | "info";

export const apiEndpoints = [
  "/health",
  "/api/v1/dashboard/summary",
  "/api/v1/forecasts/run",
  "/api/v1/optimization/run",
  "/api/v1/recommendations/run",
];

export const kpis = [
  { label: "Demo Grid Health", value: "—", unit: "%", trend: "flat" as const, delta: "No verified telemetry", tone: "info" as Tone },
  { label: "Demo System Uptime", value: "—", unit: "%", trend: "flat" as const, delta: "No service history", tone: "info" as Tone },
  { label: "Solar Production", value: "—", unit: "kW", trend: "flat" as const, delta: "No inverter feed", tone: "info" as Tone },
  { label: "Site Demand", value: "—", unit: "kW", trend: "flat" as const, delta: "No meter feed", tone: "info" as Tone },
  { label: "Battery SoC", value: "—", unit: "%", trend: "flat" as const, delta: "No BMS feed", tone: "info" as Tone },
  { label: "Carbon Accounting", value: "—", unit: "kgCO2e", trend: "flat" as const, delta: "No verified baseline", tone: "info" as Tone },
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
    id: "NGRID-REVIEW-101",
    tag: "DATA QUALITY",
    title: "Verify synchronized generation and load meter feeds",
    impact: "No impact estimate",
    confidence: null,
    endpoint: "/api/v1/recommendations/run",
  },
  {
    id: "NGRID-REVIEW-102",
    tag: "STORAGE SAFETY",
    title: "Confirm battery BMS limits, reserve policy and operating constraints",
    impact: "No dispatch plan",
    confidence: null,
    endpoint: "/api/v1/optimization/run",
  },
  {
    id: "NGRID-REVIEW-103",
    tag: "TARIFF INPUT",
    title: "Register tariff schedule and verified grid carbon factors",
    impact: "Not calculated",
    confidence: null,
    endpoint: "/api/v1/forecasts/run",
  },
  {
    id: "NGRID-REVIEW-104",
    tag: "BASELINE",
    title: "Define a measured baseline and reporting period before impact accounting",
    impact: "Not measured",
    confidence: null,
    endpoint: "/api/v1/dashboard/summary",
  },
];

export const alerts = [
  { sev: "info", asset: "Demo meter group A", msg: "Sample alert fixture · no live meter feed", t: "demo" },
  { sev: "warning", asset: "Demo battery group A", msg: "Verify BMS status before any dispatch planning", t: "demo" },
  { sev: "info", asset: "Demo solar group A", msg: "Inverter telemetry source not connected", t: "demo" },
  { sev: "warning", asset: "Demo site baseline", msg: "Impact accounting withheld until baseline is verified", t: "demo" },
];

export const assets = [
  ["DEMO-SS-01", "Demo Substation A", "Substation", "—", "—", "unverified"],
  ["DEMO-SS-02", "Demo Substation B", "Substation", "—", "—", "unverified"],
  ["DEMO-BS-01", "Demo Battery A", "Battery", "—", "—", "unverified"],
  ["DEMO-SF-01", "Demo Solar Array A", "Solar", "—", "—", "unverified"],
  ["DEMO-SF-02", "Demo Solar Array B", "Solar", "—", "—", "unverified"],
  ["DEMO-BS-02", "Demo Battery B", "Battery", "—", "—", "unverified"],
  ["DEMO-WF-01", "Demo Wind Site A", "Wind", "—", "—", "unverified"],
] as const;

export const substations = [
  ["DEMO-SS-01", "Demo Substation A", "—", "—", "unverified"],
  ["DEMO-SS-02", "Demo Substation B", "—", "—", "unverified"],
  ["DEMO-SS-03", "Demo Substation C", "—", "—", "unverified"],
  ["DEMO-SS-04", "Demo Substation D", "—", "—", "unverified"],
  ["DEMO-SS-05", "Demo Substation E", "—", "—", "unverified"],
] as const;

export const batteryFleet = [
  { id: "DEMO-BS-01", name: "Demo Battery A", soc: "—", power: "—", reserve: "—", status: "unverified" },
  { id: "DEMO-BS-02", name: "Demo Battery B", soc: "—", power: "—", reserve: "—", status: "unverified" },
  { id: "DEMO-BS-03", name: "Demo Battery C", soc: "—", power: "—", reserve: "—", status: "unverified" },
];

export const forecastRows = [
  { window: "Next 24h", peak: "—", renewable: "—", risk: "Not assessed", action: "Connect validated weather and load data" },
  { window: "7 days", peak: "—", renewable: "—", risk: "Not assessed", action: "Build and validate a time-series baseline" },
  { window: "30 days", peak: "—", renewable: "—", risk: "Not assessed", action: "No forecast issued" },
];

export const impact = {
  gridImportReductionKwh: "—",
  carbonReductionKg: "—",
  selfConsumptionGainPct: "—",
  reservePct: "—",
};
