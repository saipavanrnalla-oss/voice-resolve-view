import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/AppShell";
import { CHART_COLORS, DropOffFunnel, PageHeader, Panel } from "@/components/kit";
import { CATEGORY_STATS, APPEAL_TREND } from "@/lib/mock-analytics";

export const Route = createFileRoute("/next-step-analytics")({
  head: () => ({
    meta: [
      { title: "Next-Step Analytics | ArogyaLink TPA" },
      { name: "description", content: "Terminal-state outcomes of claim rejection calls: appeal guidance given, grievance flagged, closed and vulnerability escalations." },
      { property: "og:title", content: "Next-Step Analytics — ArogyaLink TPA" },
      { property: "og:description", content: "Call-derived terminal state funnel and trends by rejection category." },
    ],
  }),
  component: NextStepAnalytics,
});

const tip = { contentStyle: { borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 } };

const FUNNEL = [
  { stage: "Rejected — call queued", value: 18420 },
  { stage: "Reason Confirmed", value: 8721 },
  { stage: "Appeal Guidance Given", value: 4104 },
  { stage: "Grievance Flagged", value: 1368 },
  { stage: "Closed — No Further Action", value: 2986 },
  { stage: "Escalated — Vulnerability", value: 263 },
];

const CATEGORY_MIX = CATEGORY_STATS.map((c) => ({
  short: c.short,
  "Appeal Guidance Given": c.appealRate,
  "Grievance Flagged": c.grievanceRate,
  "Closed — No Further Action": Math.max(5, 100 - c.appealRate - c.grievanceRate - 12),
  "Escalated — Vulnerability": 12 - (c.grievanceRate > 20 ? 6 : 3),
}));

function NextStepAnalytics() {
  return (
    <AppShell crumb="Next-Step Analytics">
      <PageHeader title="Next-Step Analytics" subtitle="ArogyaLink TPA · Jun 2026" />

      <Panel title="Terminal state funnel">
        <DropOffFunnel steps={FUNNEL.map((f) => f.value)} />
        <ul className="mt-4 grid gap-2 md:grid-cols-2">
          {FUNNEL.map((f) => (
            <li key={f.stage} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
              <span className="text-foreground">{f.stage}</span>
              <span className="text-muted-foreground">
                {f.value.toLocaleString("en-IN")} · {((f.value / FUNNEL[0].value) * 100).toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Appeal Guidance Given rate — last 12 weeks">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={APPEAL_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis unit="%" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <Tooltip {...tip} />
              <Line type="monotone" dataKey="appealGuidance" name="Appeal guidance given %" stroke="var(--primary)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Grievance Flagged rate — last 12 weeks">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={APPEAL_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis unit="%" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <Tooltip {...tip} />
              <Line type="monotone" dataKey="grievanceFlagged" name="Grievance flagged %" stroke="var(--danger)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel title="Terminal state mix by rejection category" className="mt-4">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={CATEGORY_MIX} margin={{ bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="short" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={70} stroke="var(--muted-foreground)" interval={0} />
            <YAxis unit="%" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
            <Tooltip {...tip} />
            {["Appeal Guidance Given", "Grievance Flagged", "Closed — No Further Action", "Escalated — Vulnerability"].map((k, i) => (
              <Bar key={k} dataKey={k} stackId="a" fill={CHART_COLORS[i]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          {["Appeal Guidance Given", "Grievance Flagged", "Closed — No Further Action", "Escalated — Vulnerability"].map((k, i) => (
            <li key={k} className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm" style={{ background: CHART_COLORS[i] }} />
              {k}
            </li>
          ))}
        </ul>
      </Panel>
    </AppShell>
  );
}
