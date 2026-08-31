import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { AnomalyBanner, CHART_COLORS, DropOffFunnel, Panel, PageHeader, StatCard, StatusPill } from "@/components/kit";
import { ALL_CLAIMS, formatINR, TERMINAL_STATES } from "@/lib/mock-data";
import {
  CATEGORY_STATS,
  DELIVERY_FUNNEL,
  STATE_VOLUME,
  TERMINAL_TREND,
} from "@/lib/mock-analytics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Claims Rejection Resolution — Executive Dashboard | ArogyaLink TPA" },
      {
        name: "description",
        content:
          "Voice agent reporting on claim rejection calls for ArogyaLink TPA: connect rate, comprehension, terminal states, distress and rejection reason mix.",
      },
      { property: "og:title", content: "Claims Rejection Resolution — Executive Dashboard" },
      {
        property: "og:description",
        content: "Call-derived analytics on claim rejection outreach for ArogyaLink TPA, Jun 2026.",
      },
    ],
  }),
  component: ExecutiveDashboard,
});

const tooltipStyle = {
  contentStyle: {
    borderRadius: 10,
    border: "1px solid var(--border)",
    fontSize: 12,
    boxShadow: "var(--shadow-card)",
  },
};

function ExecutiveDashboard() {
  const [sortBy, setSortBy] = useState<"value" | "distressScore">("value");
  const topCalls = [...ALL_CLAIMS].sort((a, b) => b[sortBy] - a[sortBy]).slice(0, 8);
  const maxState = Math.max(...STATE_VOLUME.map((s) => s.volume));

  return (
    <AppShell>
      <PageHeader
        title="Claims Rejection Resolution — Executive Dashboard"
        subtitle="ArogyaLink TPA · Jun 2026"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard label="Rejection Calls" value="742" sublabel="today · 18,420 MTD" tone="primary" trend={{ dir: "up", text: "6.2%" }} />
        <StatCard label="Connect Rate" value="64.0%" sublabel="11,793 of 18,420" tone="info" trend={{ dir: "up", text: "1.8 pts" }} />
        <StatCard label="Successful Notification Rate" value="56.5%" sublabel="reason explained on call" tone="info" trend={{ dir: "up", text: "2.1 pts" }} />
        <StatCard label="Comprehension Confirmed Rate" value="47.3%" sublabel="8,721 calls" tone="success" trend={{ dir: "up", text: "3.4 pts" }} />
        <StatCard label="Appeal Guidance Given Rate" value="34.8%" sublabel="of connected calls" tone="warning" trend={{ dir: "up", text: "0.9 pts" }} />
        <StatCard label="Grievance Flagged Rate" value="11.6%" sublabel="of connected calls" tone="danger" trend={{ dir: "up", text: "1.3 pts", good: false }} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Panel title="Voice Channel API">
          <div className="flex items-center justify-between">
            <StatusPill status="Healthy" />
            <span className="text-sm text-muted-foreground">412 ms median latency</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">3,218 calls placed in the last 24 hours.</p>
        </Panel>
        <Panel title="Compliance Engine">
          <div className="flex items-center justify-between">
            <StatusPill status="Healthy" />
            <span className="text-sm text-muted-foreground">27 call-derived flags today</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            19 disclosure gaps · 6 prohibited-language hits · 2 calling-window breaches.
          </p>
        </Panel>
        <Panel title="AI Agent Registry">
          <div className="flex items-center justify-between">
            <StatusPill status="Healthy" />
            <span className="text-sm text-muted-foreground">99.94% uptime (30d)</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            5 agents registered: Claims Data Sync, Voice, Channel Orchestrator, Sentiment, Disposition.
          </p>
        </Panel>
      </div>

      <div className="mt-4">
        <AnomalyBanner
          headline="WhatsApp fallback latency elevated"
          detail="Median WhatsApp send latency at 6.8 s against a 2.0 s baseline, affecting the retry cascade for 168 in-flight calls."
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Terminal State Trend — last 12 weeks" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={TERMINAL_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <Tooltip {...tooltipStyle} />
              {TERMINAL_STATES.map((s, i) => (
                <Area
                  key={s}
                  type="monotone"
                  dataKey={s}
                  stackId="1"
                  stroke={CHART_COLORS[i]}
                  fill={CHART_COLORS[i]}
                  fillOpacity={0.75}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            {TERMINAL_STATES.map((s, i) => (
              <li key={s} className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm" style={{ background: CHART_COLORS[i] }} />
                {s}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Rejection Reason Breakdown — % of call volume">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={CATEGORY_STATS}
                dataKey="volume"
                nameKey="short"
                innerRadius={58}
                outerRadius={98}
                paddingAngle={1}
              >
                {CATEGORY_STATS.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            {CATEGORY_STATS.map((c, i) => (
              <li key={c.short} className="flex items-center gap-1.5">
                <span className="size-2 rounded-sm" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="truncate">{c.short}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Call Delivery Funnel">
          <DropOffFunnel steps={DELIVERY_FUNNEL.map((s) => s.value)} />
          <ul className="mt-4 space-y-2">
            {DELIVERY_FUNNEL.map((s, i) => (
              <li key={s.stage} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{s.stage}</span>
                <span className="text-muted-foreground">
                  {s.value.toLocaleString("en-IN")} ·{" "}
                  {((s.value / DELIVERY_FUNNEL[0].value) * 100).toFixed(1)}%
                  {i > 0 && (
                    <span className="ml-2 text-danger">
                      −{(DELIVERY_FUNNEL[i - 1].value - s.value).toLocaleString("en-IN")}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Distress Rate by Rejection Category">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={CATEGORY_STATS} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" unit="%" />
              <YAxis type="category" dataKey="short" width={130} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="distressRate" name="Distress rate %" fill="var(--primary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Rejection concentration by state">
          <div className="grid grid-cols-5 gap-2">
            {STATE_VOLUME.map((s) => {
              const intensity = s.volume / maxState;
              return (
                <div
                  key={s.code}
                  className="rounded-lg p-2.5 text-center"
                  style={{
                    background: `color-mix(in oklab, var(--primary) ${Math.round(12 + intensity * 78)}%, white)`,
                  }}
                  title={`${s.state} · ${s.volume.toLocaleString("en-IN")} calls`}
                >
                  <p className={intensity > 0.5 ? "text-sm font-semibold text-white" : "text-sm font-semibold text-foreground"}>
                    {s.code}
                  </p>
                  <p className={intensity > 0.5 ? "text-[11px] text-white/85" : "text-[11px] text-muted-foreground"}>
                    {s.volume.toLocaleString("en-IN")}
                  </p>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel
          title="Highest-value, highest-distress calls this week"
          action={
            <div className="flex gap-1 rounded-full border border-border p-0.5 text-xs">
              {(["value", "distressScore"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setSortBy(k)}
                  className={
                    sortBy === k
                      ? "rounded-full bg-primary px-2.5 py-1 font-medium text-primary-foreground"
                      : "rounded-full px-2.5 py-1 text-muted-foreground"
                  }
                >
                  {k === "value" ? "Claim value" : "Distress score"}
                </button>
              ))}
            </div>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="label-caps pb-2 text-muted-foreground">Claim</th>
                  <th className="label-caps pb-2 text-muted-foreground">Claimant</th>
                  <th className="label-caps pb-2 text-right text-muted-foreground">Value</th>
                  <th className="label-caps pb-2 text-right text-muted-foreground">Distress</th>
                  <th className="label-caps pb-2 text-muted-foreground">Terminal state</th>
                </tr>
              </thead>
              <tbody>
                {topCalls.map((c) => (
                  <tr key={c.id} className="border-b border-border/60 last:border-0">
                    <td className="py-2">
                      <Link to="/calls/$claimId" params={{ claimId: c.id }} className="font-medium text-primary">
                        {c.id}
                      </Link>
                    </td>
                    <td className="py-2 text-foreground">{c.claimant}</td>
                    <td className="py-2 text-right text-foreground">{formatINR(c.value)}</td>
                    <td className="py-2 text-right text-foreground">{c.distressScore}</td>
                    <td className="py-2">
                      <StatusPill status={c.terminalState} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
