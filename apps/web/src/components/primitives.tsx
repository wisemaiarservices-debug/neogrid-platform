import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="border-b border-border bg-background/40">
      <div className="px-6 py-5 flex items-end justify-between gap-6">
        <div>
          {eyebrow && (
            <div className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1.5">
              {eyebrow}
            </div>
          )}
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Panel({
  title,
  subtitle,
  actions,
  children,
  className,
  padded = true,
}: {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={cn("panel flex flex-col min-w-0", className)}>
      {(title || actions) && (
        <header className="flex items-center justify-between px-4 h-10 border-b border-border">
          <div className="flex items-baseline gap-2 min-w-0">
            {title && <h2 className="mono text-[11px] uppercase tracking-[0.16em] text-foreground/90 truncate">{title}</h2>}
            {subtitle && <span className="text-xs text-muted-foreground truncate">{subtitle}</span>}
          </div>
          {actions && <div className="flex items-center gap-1.5">{actions}</div>}
        </header>
      )}
      <div className={cn("flex-1 min-w-0", padded && "p-4")}>{children}</div>
    </section>
  );
}

export function Metric({
  label,
  value,
  unit,
  delta,
  trend = "up",
  tone = "default",
}: {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  tone?: "default" | "success" | "warning" | "danger" | "info";
}) {
  const toneColor =
    tone === "success"
      ? "text-[color:var(--success)]"
      : tone === "warning"
        ? "text-[color:var(--warning)]"
        : tone === "danger"
          ? "text-[color:var(--danger)]"
          : tone === "info"
            ? "text-[color:var(--info)]"
            : "text-foreground";
  return (
    <div className="min-w-0">
      <div className="mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-1.5">
        <span className={cn("mono text-2xl font-semibold tabular-nums", toneColor)}>{value}</span>
        {unit && <span className="mono text-xs text-muted-foreground">{unit}</span>}
      </div>
      {delta && (
        <div
          className={cn(
            "mono text-[11px] mt-1 tabular-nums",
            trend === "up" && "text-[color:var(--success)]",
            trend === "down" && "text-[color:var(--danger)]",
            trend === "flat" && "text-muted-foreground",
          )}
        >
          {trend === "up" ? "UP" : trend === "down" ? "DOWN" : "STABLE"} {delta}
        </div>
      )}
    </div>
  );
}

export function StatusPill({
  status,
  label,
}: {
  status: "online" | "warning" | "offline" | "info";
  label: string;
}) {
  const map = {
    online: "text-[color:var(--success)] bg-[color:var(--success)]/10 border-[color:var(--success)]/30",
    warning: "text-[color:var(--warning)] bg-[color:var(--warning)]/10 border-[color:var(--warning)]/30",
    offline: "text-[color:var(--danger)] bg-[color:var(--danger)]/10 border-[color:var(--danger)]/30",
    info: "text-[color:var(--info)] bg-[color:var(--info)]/10 border-[color:var(--info)]/30",
  };
  return (
    <span className={cn("mono inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm border", map[status])}>
      <span className="status-dot" />
      {label}
    </span>
  );
}

export function Sparkline({ data, color = "var(--primary)", height = 36 }: { data: number[]; color?: string; height?: number }) {
  const w = 120;
  const h = height;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  const area = `0,${h} ${points} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      <polygon points={area} fill={color} opacity={0.12} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}
