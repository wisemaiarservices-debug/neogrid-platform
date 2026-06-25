import {
  Activity,
  BarChart3,
  BatteryCharging,
  Boxes,
  FileText,
  Gauge,
  Leaf,
  LineChart,
  Network,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "../lib/utils";

type NavItem = {
  path: string;
  label: string;
  icon: typeof Gauge;
};

const nav: NavItem[] = [
  { path: "/", label: "Overview", icon: Gauge },
  { path: "/assets", label: "Assets", icon: Boxes },
  { path: "/grid", label: "Grid Operations", icon: Activity },
  { path: "/batteries", label: "Batteries", icon: BatteryCharging },
  { path: "/forecasts", label: "Forecasts", icon: LineChart },
  { path: "/digital-twin", label: "Digital Twin", icon: Network },
  { path: "/recommendations", label: "Recommendations", icon: Sparkles },
  { path: "/sustainability", label: "Sustainability", icon: Leaf },
  { path: "/reports", label: "Reports", icon: FileText },
];

export function AppShell({ children, path, apiStatus }: { children: React.ReactNode; path: string; apiStatus: "connected" | "fallback" }) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-[oklch(0.135_0.012_240)]">
        <div className="px-3 py-3 border-b border-border">
          <div className="w-full flex items-center gap-2 px-2.5 py-2 rounded-sm border border-border bg-panel-elevated/70">
            <div className="size-8 rounded-sm bg-primary/15 grid place-items-center ring-1 ring-primary/30 shrink-0">
              <Zap className="size-4 text-primary" strokeWidth={2.5} />
            </div>
            <div className="leading-tight text-left flex-1 min-w-0">
              <div className="text-sm font-semibold tracking-tight truncate">NOVA Energy</div>
              <div className="mono text-[10px] uppercase tracking-widest text-muted-foreground truncate">NeoGrid / v0.1</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {nav.map((item) => {
            const active = path === item.path;
            const Icon = item.icon;
            return (
              <a
                key={item.path}
                href={item.path}
                className={cn(
                  "group flex items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-panel-elevated text-foreground border-l-2 border-primary -ml-px"
                    : "text-foreground/75 hover:text-foreground hover:bg-panel-elevated/70",
                )}
              >
                <Icon className="size-4 shrink-0 opacity-80" strokeWidth={2} />
                <span className="truncate flex-1">{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <div className="panel-elevated p-3 text-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={cn("status-dot live", apiStatus === "connected" ? "text-[color:var(--success)]" : "text-[color:var(--warning)]")} />
              <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {apiStatus === "connected" ? "API connected" : "Fallback mode"}
              </span>
            </div>
            <div className="text-foreground/90 leading-snug">Operator-approved energy intelligence for SolarHub renewable infrastructure.</div>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-14 border-b border-border bg-background/60 backdrop-blur sticky top-0 z-20 flex items-center px-4 gap-3">
          <div className="flex items-center gap-2 mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="status-dot text-primary live" />
            Live / SolarHub Energy Site
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="mono text-[10px] uppercase tracking-widest text-muted-foreground">No autonomous control</span>
            <span className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2 py-1 text-xs text-muted-foreground">
              <BarChart3 className="size-3.5" /> 5s aggregate
            </span>
          </div>
        </header>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
