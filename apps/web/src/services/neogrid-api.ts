export type ApiStatus = "connected" | "fallback";

export type DashboardSummary = {
  scenario: string;
  generated_at?: string;
  kpis: Array<{ label: string; value: number; unit: string; trend: string }>;
  forecast?: Record<string, unknown>;
  optimization?: Record<string, unknown>;
  recommendations?: Array<Record<string, unknown>>;
};

const API_BASE = import.meta.env.VITE_NEOGRID_API_BASE || "http://localhost:8000";

export async function getDashboardSummary(): Promise<{ status: ApiStatus; data: DashboardSummary | null }> {
  try {
    const response = await fetch(`${API_BASE}/api/v1/dashboard/summary`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`NeoGrid API returned ${response.status}`);
    return { status: "connected", data: await response.json() };
  } catch {
    return { status: "fallback", data: null };
  }
}
