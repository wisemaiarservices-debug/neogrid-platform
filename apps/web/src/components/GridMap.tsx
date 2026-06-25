import { useState } from "react";
import { cn } from "../lib/utils";

type Asset = {
  id: string;
  type: "solar" | "battery" | "substation" | "wind";
  x: number;
  y: number;
  label: string;
  status: "online" | "warning" | "offline";
  mw: number;
};

const ASSETS: Asset[] = [
  { id: "SF-01", type: "solar", x: 18, y: 32, label: "Mojave Solar A", status: "online", mw: 248 },
  { id: "SF-02", type: "solar", x: 32, y: 58, label: "Topaz Field", status: "online", mw: 312 },
  { id: "SF-03", type: "solar", x: 64, y: 22, label: "Ivanpah West", status: "warning", mw: 184 },
  { id: "BS-01", type: "battery", x: 42, y: 40, label: "Moss Landing", status: "online", mw: 730 },
  { id: "BS-02", type: "battery", x: 70, y: 65, label: "Crimson Storage", status: "online", mw: 350 },
  { id: "BS-03", type: "battery", x: 22, y: 72, label: "Gateway BESS", status: "warning", mw: 230 },
  { id: "SS-01", type: "substation", x: 50, y: 50, label: "Cascade Hub", status: "online", mw: 1200 },
  { id: "SS-02", type: "substation", x: 80, y: 38, label: "Pinecrest 500kV", status: "online", mw: 980 },
  { id: "SS-03", type: "substation", x: 12, y: 18, label: "Olympic Tie", status: "online", mw: 640 },
  { id: "WF-01", type: "wind", x: 86, y: 78, label: "Altamont Pass", status: "online", mw: 168 },
  { id: "WF-02", type: "wind", x: 8, y: 84, label: "Tehachapi Ridge", status: "offline", mw: 0 },
];

const COLORS = {
  solar: "var(--warning)",
  battery: "var(--primary)",
  substation: "var(--info)",
  wind: "var(--accent)",
};

export function GridMap({ height = 420 }: { height?: number }) {
  const [hover, setHover] = useState<Asset | null>(null);
  const [layers, setLayers] = useState({ solar: true, battery: true, substation: true, wind: true });

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {(Object.keys(layers) as (keyof typeof layers)[]).map((key) => (
          <button
            key={key}
            onClick={() => setLayers((previous) => ({ ...previous, [key]: !previous[key] }))}
            className={cn(
              "mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-sm border transition",
              layers[key] ? "border-border bg-panel text-foreground" : "border-border/50 text-muted-foreground/60 line-through",
            )}
          >
            <span className="inline-block size-2 rounded-full mr-1.5 align-middle" style={{ background: COLORS[key] }} />
            {key}
          </button>
        ))}
        <div className="ml-auto mono text-[10px] uppercase tracking-widest text-muted-foreground">GIS / WGS84 / NA-West</div>
      </div>

      <div className="relative grid-bg rounded-sm border border-border overflow-hidden bg-[color:var(--panel)]" style={{ height }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[
            ["SS-01", "SF-01"], ["SS-01", "SF-02"], ["SS-01", "BS-01"], ["SS-01", "SS-02"],
            ["SS-02", "SF-03"], ["SS-02", "BS-02"], ["SS-02", "WF-01"], ["SS-03", "SF-01"],
            ["SS-03", "BS-03"], ["BS-03", "WF-02"],
          ].map(([a, b], i) => {
            const A = ASSETS.find((asset) => asset.id === a)!;
            const B = ASSETS.find((asset) => asset.id === b)!;
            return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="var(--primary)" strokeOpacity={0.25} strokeWidth={0.25} strokeDasharray="0.6 0.4" />;
          })}
        </svg>

        {ASSETS.filter((asset) => layers[asset.type]).map((asset) => (
          <button
            key={asset.id}
            onMouseEnter={() => setHover(asset)}
            onMouseLeave={() => setHover(null)}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${asset.x}%`, top: `${asset.y}%` }}
          >
            <span
              className={cn("block rounded-full transition-transform group-hover:scale-150", asset.status === "offline" && "opacity-50")}
              style={{
                width: asset.type === "substation" ? 12 : 8,
                height: asset.type === "substation" ? 12 : 8,
                background: COLORS[asset.type],
                boxShadow: `0 0 12px ${COLORS[asset.type]}`,
              }}
            />
            {asset.status === "online" && <span className="absolute inset-0 rounded-full animate-ping" style={{ background: COLORS[asset.type], opacity: 0.4 }} />}
          </button>
        ))}

        {hover && (
          <div className="absolute panel-elevated p-2.5 text-xs pointer-events-none z-10 min-w-[160px]" style={{ left: `${hover.x}%`, top: `${hover.y}%`, transform: "translate(12px, -50%)" }}>
            <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground">{hover.id} / {hover.type}</div>
            <div className="font-medium mt-0.5">{hover.label}</div>
            <div className="mono mt-1 text-foreground/80">{hover.mw.toLocaleString()} MW / {hover.status}</div>
          </div>
        )}

        <div className="absolute bottom-3 left-3 mono text-[10px] text-muted-foreground flex items-center gap-2">
          <div className="h-px w-10 bg-foreground/40" />
          50 km
        </div>
      </div>
    </div>
  );
}
