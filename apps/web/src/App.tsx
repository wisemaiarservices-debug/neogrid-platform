import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  Cpu,
  Leaf,
  Sun,
  TrendingUp,
  Wind,
  Zap,
} from "lucide-react";
import { AppShell } from "./components/AppShell";
import { GridMap } from "./components/GridMap";
import { Metric, PageHeader, Panel, Sparkline, StatusPill } from "./components/primitives";
import {
  alerts,
  apiEndpoints,
  assets,
  batteryFleet,
  forecastRows,
  generationMix,
  hourlyEnergy,
  impact,
  kpis,
  recommendations,
  substations,
} from "./data/neogrid-data";
import { getDashboardSummary, type ApiStatus } from "./services/neogrid-api";

export function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [apiStatus, setApiStatus] = useState<ApiStatus>("fallback");

  useEffect(() => {
    getDashboardSummary().then((result) => setApiStatus(result.status));
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a");
      if (!anchor || anchor.target || anchor.origin !== window.location.origin) return;
      event.preventDefault();
      window.history.pushState(null, "", anchor.pathname);
      setPath(anchor.pathname);
    };
    const onPop = () => setPath(window.location.pathname);
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  const page = useMemo(() => renderPage(path), [path]);

  return (
    <AppShell path={path} apiStatus={apiStatus}>
      {page}
    </AppShell>
  );
}

function renderPage(path: string) {
  if (path === "/assets") return <AssetsPage />;
  if (path === "/grid") return <GridPage />;
  if (path === "/batteries") return <BatteriesPage />;
  if (path === "/forecasts") return <ForecastsPage />;
  if (path === "/digital-twin") return <DigitalTwinPage />;
  if (path === "/recommendations") return <RecommendationsPage />;
  if (path === "/sustainability") return <SustainabilityPage />;
  if (path === "/reports") return <ReportsPage />;
  return <OverviewPage />;
}

function OverviewPage() {
  return (
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-px bg-border rounded-sm overflow-hidden">
        {kpis.map((metric) => (
          <div key={metric.label} className="bg-background p-4">
            <Metric {...metric} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel title="Generation vs Demand" subtitle="Illustrative sample series · not operational data" className="col-span-12 xl:col-span-8" actions={<Legend />}>
          <GenerationChart />
        </Panel>
        <Panel title="Grid Health" className="col-span-12 md:col-span-6 xl:col-span-4">
          <GridHealth />
        </Panel>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel title="Asset Map / GIS" subtitle="11 sites / 4 layers" className="col-span-12 xl:col-span-8">
          <GridMap height={380} />
        </Panel>
        <div className="col-span-12 xl:col-span-4 space-y-4">
          <GenerationMix />
          <BatteryIntelligence />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <ForecastPanel />
        <RecommendationQueue compact />
        <AlertsPanel />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <AssetsTable className="col-span-12 xl:col-span-7" />
        <SustainabilitySummary className="col-span-12 xl:col-span-5" />
      </div>
    </div>
  );
}

function AssetsPage() {
  return (
    <div>
      <PageHeader eyebrow="Asset registry" title="NeoGrid Assets" description="Solar arrays, battery systems, substations, wind resources, and telemetry ownership." />
      <div className="p-5">
        <AssetsTable />
      </div>
    </div>
  );
}

function GridPage() {
  const frequency = Array.from({ length: 60 }, (_, i) => ({ t: i, hz: 60 + (Math.sin(i / 3) + Math.sin(i / 7)) * 0.04 }));
  return (
    <div>
      <PageHeader eyebrow="DEMO SCADA / SAMPLE SERIES" title="Grid Operations" description="Illustrative frequency and flow examples only. No live SCADA, transmission or substation telemetry is connected." />
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-px bg-border rounded-sm overflow-hidden">
          <div className="bg-background p-4"><Metric label="Frequency" value="60.02" unit="Hz" tone="success" /></div>
          <div className="bg-background p-4"><Metric label="Voltage" value="500.3" unit="kV" tone="success" /></div>
          <div className="bg-background p-4"><Metric label="Net Flow" value="+182" unit="MW" tone="info" /></div>
          <div className="bg-background p-4"><Metric label="Losses" value="2.8" unit="%" /></div>
          <div className="bg-background p-4"><Metric label="Reserves" value="640" unit="MW" tone="success" /></div>
          <div className="bg-background p-4"><Metric label="Open Faults" value="2" tone="warning" /></div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <Panel title="Illustrative Topology" subtitle="Conceptual GIS-style sample · not a live network" className="col-span-12 xl:col-span-8">
            <GridMap height={460} />
          </Panel>
          <div className="col-span-12 xl:col-span-4 space-y-4">
            <Panel title="System Frequency" subtitle="last 60s / target 60.00 Hz">
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={frequency} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid stroke="var(--grid-line)" strokeDasharray="2 4" vertical={false} />
                    <XAxis dataKey="t" hide />
                    <YAxis domain={[59.85, 60.15]} stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", fontSize: 12 }} />
                    <Area type="monotone" dataKey="hz" stroke="var(--primary)" strokeWidth={1.5} fill="var(--primary)" fillOpacity={0.12} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>
            <SubstationRoster />
          </div>
        </div>
      </div>
    </div>
  );
}

function BatteriesPage() {
  return (
    <div>
      <PageHeader eyebrow="Battery analytics" title="Storage Fleet" description="State of charge, reserve windows, throughput, and operator-approved discharge plans." />
      <div className="p-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
        {batteryFleet.map((battery) => (
          <Panel key={battery.id} title={`${battery.id} / ${battery.name}`} subtitle={battery.status}>
            <Metric label="State of charge" value={battery.soc} unit="%" tone={battery.status === "online" ? "success" : "warning"} />
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="panel-elevated p-3"><div className="text-muted-foreground">Power</div><div className="mono">{battery.power}</div></div>
              <div className="panel-elevated p-3"><div className="text-muted-foreground">Reserve</div><div className="mono">{battery.reserve}</div></div>
            </div>
            <div className="mt-4 text-[10px] text-muted-foreground">No battery telemetry connected · demo record only</div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

function ForecastsPage() {
  return (
    <div>
      <PageHeader eyebrow="Forecast engine" title="Demand and renewable forecasts" description="Forecast generation is disabled until validated time-series, weather, equipment and tariff data are connected." />
      <div className="p-5 space-y-4">
        <ForecastPanel wide />
        <Panel title="Forecast windows" padded={false}>
          <table className="w-full text-xs">
            <tbody className="divide-y divide-border">
              {forecastRows.map((row) => (
                <tr key={row.window} className="hover:bg-panel-elevated/30">
                  <td className="px-4 py-3 mono text-primary">{row.window}</td>
                  <td className="px-4 py-3">Peak {row.peak}</td>
                  <td className="px-4 py-3">Renewable {row.renewable}</td>
                  <td className="px-4 py-3 text-[color:var(--warning)]">{row.risk}</td>
                  <td className="px-4 py-3">{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}

function DigitalTwinPage() {
  return (
    <div>
      <PageHeader eyebrow="Digital Twin" title="Energy system model" description="NOVA Twin links solar arrays, batteries, substations, irrigation load, carbon intensity, and operator actions." />
      <div className="p-5 grid grid-cols-12 gap-4">
        <Panel title="Topology twin" className="col-span-12 xl:col-span-8">
          <GridMap height={520} />
        </Panel>
        <Panel title="Twin chain" className="col-span-12 xl:col-span-4">
          {["Solar production", "Battery reserve", "Irrigation load", "Grid import", "Carbon intensity", "Operator approval"].map((item, index) => (
            <div key={item} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <span className="mono text-primary">{String(index + 1).padStart(2, "0")}</span>
              <span>{item}</span>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function RecommendationsPage() {
  return (
    <div>
      <PageHeader eyebrow="NOVA Recommendations" title="Operator-approved energy actions" description="NeoGrid recommends optimization plans, but physical dispatch remains gated by operator approval." />
      <div className="p-5">
        <RecommendationQueue />
      </div>
    </div>
  );
}

function SustainabilityPage() {
  return (
    <div>
      <PageHeader eyebrow="Carbon analytics" title="Sustainability and carbon impact" description="Impact reporting is withheld until metered baselines, reporting periods and verified grid factors are available." />
      <div className="p-5">
        <SustainabilitySummary />
      </div>
    </div>
  );
}

function ReportsPage() {
  return (
    <div>
      <PageHeader eyebrow="Reports" title="Pilot-ready energy report" description="Demonstration report only. No measured energy, carbon, savings or dispatch outcomes are available." />
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="API compatibility">
          <ul className="space-y-2">
            {apiEndpoints.map((endpoint) => (
              <li key={endpoint} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                <span className="mono text-primary">{endpoint}</span>
                <StatusPill status="info" label="supported" />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Impact accounting · not calculated">
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Grid import reduction" value={impact.gridImportReductionKwh} unit="kWh" tone="success" />
            <Metric label="Carbon reduction" value={impact.carbonReductionKg} unit="kg CO2e" tone="success" />
            <Metric label="Self-consumption gain" value={impact.selfConsumptionGainPct} unit="%" tone="success" />
            <Metric label="Battery reserve" value={impact.reservePct} unit="%" tone="info" />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function GenerationChart() {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={hourlyEnergy} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--grid-line)" strokeDasharray="2 4" vertical={false} />
          <XAxis dataKey="h" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 12 }} />
          <Area type="monotone" dataKey="solar" stroke="var(--warning)" strokeWidth={1.5} fill="var(--warning)" fillOpacity={0.18} />
          <Area type="monotone" dataKey="wind" stroke="var(--info)" strokeWidth={1.5} fill="var(--info)" fillOpacity={0.12} />
          <Line type="monotone" dataKey="demand" stroke="var(--primary)" strokeWidth={1.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function Legend() {
  return (
    <>
      <span className="mono text-[10px] uppercase tracking-widest text-[color:var(--warning)] flex items-center gap-1"><span className="size-1.5 rounded-full bg-[color:var(--warning)]" /> Solar</span>
      <span className="mono text-[10px] uppercase tracking-widest text-[color:var(--info)] flex items-center gap-1"><span className="size-1.5 rounded-full bg-[color:var(--info)]" /> Wind</span>
      <span className="mono text-[10px] uppercase tracking-widest text-primary flex items-center gap-1"><span className="size-1.5 rounded-full bg-primary" /> Demand</span>
    </>
  );
}

function GridHealth() {
  return (
    <>
      <div className="flex items-center gap-5">
        <HealthRing score={98.4} />
        <div className="flex-1 space-y-2.5">
          {[
            ["Generation", 99, "success"],
            ["Transmission", 97, "success"],
            ["Distribution", 96, "success"],
            ["Storage", 94, "warning"],
            ["Cyber posture", 99, "success"],
          ].map(([label, value, tone]) => (
            <div key={label as string} className="text-xs">
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">{label}</span>
                <span className="mono tabular-nums">{value}%</span>
              </div>
              <div className="h-1 bg-border/60 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${value}%`, background: tone === "warning" ? "var(--warning)" : "var(--success)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-3 text-center">
        <div><div className="mono text-lg tabular-nums text-[color:var(--success)]">1,238</div><div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">Online</div></div>
        <div><div className="mono text-lg tabular-nums text-[color:var(--warning)]">38</div><div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">Degraded</div></div>
        <div><div className="mono text-lg tabular-nums text-[color:var(--danger)]">8</div><div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">Offline</div></div>
      </div>
    </>
  );
}

function HealthRing({ score }: { score: number }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative size-32 shrink-0">
      <svg viewBox="0 0 100 100" className="size-32 -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--success)" strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="mono text-2xl font-semibold tabular-nums text-[color:var(--success)]">{score}</div>
          <div className="mono text-[9px] uppercase tracking-widest text-muted-foreground">Health Score</div>
        </div>
      </div>
    </div>
  );
}

function GenerationMix() {
  return (
    <Panel title="Generation Mix" subtitle="instantaneous %">
      <div className="space-y-3">
        {generationMix.map((mix) => (
          <div key={mix.name}>
            <div className="flex justify-between text-xs mb-1">
              <div className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: mix.color }} /><span>{mix.name}</span></div>
              <span className="mono tabular-nums">{mix.v}%</span>
            </div>
            <div className="h-1.5 bg-border/60 overflow-hidden rounded-full"><div className="h-full" style={{ width: `${mix.v}%`, background: mix.color }} /></div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Renewable share</span>
        <span className="mono text-[color:var(--success)] tabular-nums text-base">88%</span>
      </div>
    </Panel>
  );
}

function BatteryIntelligence() {
  return (
    <Panel title="Battery Intelligence" subtitle="BMS feed not connected">
      <div className="grid grid-cols-2 gap-3">
        <Metric label="State of charge" value="—" unit="%" tone="info" />
        <Metric label="Throughput" value="—" unit="kWh" />
        <Metric label="State of health" value="—" unit="%" />
        <Metric label="Cycle count" value="—" unit="cycles" />
      </div>
      <div className="mt-3 text-xs text-muted-foreground">Battery metrics remain unavailable until a verified BMS integration supplies timestamps, units and asset identity.</div>
    </Panel>
  );
}

function ForecastPanel({ wide = false }: { wide?: boolean }) {
  return (
    <Panel title="Demand Forecasting" subtitle="Forecast method not validated · sample chart only" className={wide ? "" : "col-span-12 xl:col-span-5"} actions={<span className="mono text-[10px] uppercase tracking-widest text-primary">24h</span>}>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlyEnergy} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="var(--grid-line)" strokeDasharray="2 4" vertical={false} />
            <XAxis dataKey="h" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: "var(--accent)", opacity: 0.08 }} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 12 }} />
            <Bar dataKey="demand" radius={[2, 2, 0, 0]}>
              {hourlyEnergy.map((row) => <Cell key={row.h} fill={Number(row.h) >= 16 && Number(row.h) <= 20 ? "var(--warning)" : "var(--info)"} fillOpacity={0.7} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Forecast status</span>
        <span className="mono tabular-nums">Not generated</span>
      </div>
    </Panel>
  );
}

function RecommendationQueue({ compact = false }: { compact?: boolean }) {
  const items = compact ? recommendations.slice(0, 4) : recommendations;
  return (
    <Panel title="NOVA Review Checklist" subtitle="Rule-based data readiness · no dispatch recommendations" className={compact ? "col-span-12 md:col-span-6 xl:col-span-4" : ""} actions={<Cpu className="size-3.5 text-primary" />}>
      <ul className="divide-y divide-border -my-2">
        {items.map((rec) => (
          <li key={rec.id} className="py-2.5 first:pt-0 last:pb-0 hover:bg-panel-elevated/40 -mx-2 px-2 rounded-sm transition">
            <div className="flex items-center justify-between mb-1">
              <span className="mono text-[10px] uppercase tracking-widest text-primary">{rec.tag}</span>
              <span className="mono text-[10px] text-muted-foreground tabular-nums">Not calibrated</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm">{rec.title}</span>
              <span className="mono text-xs text-[color:var(--success)] tabular-nums">{rec.impact}</span>
            </div>
            <div className="mt-1 text-[10px] text-muted-foreground mono">{rec.endpoint}</div>
            
          </li>
        ))}
      </ul>
      <div className="mt-3 border-t border-border pt-2 text-[10px] text-muted-foreground">No dispatch action generated. Operator review required before any future recommendation.</div>
    </Panel>
  );
}

function AlertsPanel() {
  return (
    <Panel title="Alerts & Events" subtitle="last 60 min" className="col-span-12 md:col-span-6 xl:col-span-3">
      <ul className="space-y-3">
        {alerts.map((alert, index) => {
          const Icon = alert.sev === "warning" ? AlertTriangle : alert.sev === "success" ? CheckCircle2 : TrendingUp;
          const color = alert.sev === "warning" ? "text-[color:var(--warning)]" : alert.sev === "success" ? "text-[color:var(--success)]" : "text-[color:var(--info)]";
          return (
            <li key={index} className="flex items-start gap-2.5 text-xs">
              <Icon className={`size-3.5 mt-0.5 shrink-0 ${color}`} />
              <div className="min-w-0 flex-1">
                <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground flex justify-between"><span className="truncate">{alert.asset}</span><span>{alert.t}</span></div>
                <div className="mt-0.5 text-foreground/90 leading-snug">{alert.msg}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function AssetsTable({ className = "" }: { className?: string }) {
  return (
    <Panel title="Top Producing Assets" className={className} padded={false}>
      <table className="w-full text-xs">
        <thead>
          <tr className="mono text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
            <th className="text-left font-normal py-2 px-4">ID</th>
            <th className="text-left font-normal">Asset</th>
            <th className="text-left font-normal">Type</th>
            <th className="text-right font-normal">Output</th>
            <th className="text-right font-normal">Capacity</th>
            <th className="text-right font-normal pr-4">Status</th>
          </tr>
        </thead>
        <tbody className="mono tabular-nums">
          {assets.map((row) => (
            <tr key={row[0]} className="border-b border-border/60 last:border-0 hover:bg-panel-elevated/30">
              <td className="py-2 px-4 text-muted-foreground">{row[0]}</td>
              <td className="font-sans">{row[1]}</td>
              <td className="text-muted-foreground">{row[2]}</td>
              <td className="text-right text-[color:var(--success)]">{row[3]}</td>
              <td className="text-right text-muted-foreground">{row[4]}</td>
              <td className="text-right pr-4"><StatusPill status={row[5]} label={row[5]} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

function SustainabilitySummary({ className = "" }: { className?: string }) {
  return (
    <Panel title="Sustainability / Today" className={className}>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-start gap-1"><Leaf className="size-4 text-[color:var(--success)]" /><Metric label="CO2 Avoided" value="1,284" unit="tonnes" tone="success" /></div>
        <div className="flex flex-col items-start gap-1"><Sun className="size-4 text-[color:var(--warning)]" /><Metric label="Renewable" value="88" unit="%" tone="success" /></div>
        <div className="flex flex-col items-start gap-1"><Wind className="size-4 text-[color:var(--info)]" /><Metric label="Efficiency" value="94.2" unit="%" /></div>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Renewable share / 7d</div>
        <Sparkline data={[82, 85, 81, 87, 89, 90, 88]} color="var(--success)" height={48} />
        <div className="flex justify-between mono text-[10px] text-muted-foreground mt-1"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span></div>
      </div>
    </Panel>
  );
}

function SubstationRoster() {
  return (
    <Panel title="Substation Roster" padded={false}>
      <ul className="divide-y divide-border">
        {substations.map((substation) => (
          <li key={substation[0]} className="flex items-center px-4 py-2.5 text-xs gap-3 hover:bg-panel-elevated/30">
            <span className="mono text-muted-foreground w-12">{substation[0]}</span>
            <span className="flex-1 truncate">{substation[1]}</span>
            <span className="mono text-muted-foreground">{substation[2]}</span>
            <span className="mono tabular-nums w-20 text-right">{substation[3]}</span>
            <StatusPill status={substation[4]} label={substation[4]} />
          </li>
        ))}
      </ul>
    </Panel>
  );
}
