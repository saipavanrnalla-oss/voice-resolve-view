import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/AppShell";
import { CHART_COLORS, FilterPill, PageHeader, Panel } from "@/components/kit";
import { INSURERS, REJECTION_CATEGORIES, formatINR } from "@/lib/mock-data";
import { CATEGORY_STATS, REASON_BY_MONTH } from "@/lib/mock-analytics";

export const Route = createFileRoute("/rejection-analytics")({
  head: () => ({
    meta: [
      { title: "Rejection Reason Analytics | ArogyaLink TPA" },
      { name: "description", content: "Call volume, comprehension and distress rates across the ten claim rejection categories handled by the voice agent." },
      { property: "og:title", content: "Rejection Reason Analytics — ArogyaLink TPA" },
      { property: "og:description", content: "Rejection category mix by month with call-derived comprehension, appeal guidance and grievance rates." },
    ],
  }),
  component: RejectionAnalytics,
});

const tip = { contentStyle: { borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 } };

function RejectionAnalytics() {
  const [range, setRange] = useState("Jan 2026 – Jun 2026");
  const [category, setCategory] = useState("All categories");
  const [band, setBand] = useState("All claim values");
  const [insurer, setInsurer] = useState("All insurers");

  const rows = category === "All categories" ? CATEGORY_STATS : CATEGORY_STATS.filter((c) => c.category === category);

  return (
    <AppShell crumb="Rejection Reason Analytics">
      <PageHeader title="Rejection Reason Analytics" subtitle="ArogyaLink TPA · Jun 2026" />

      <div className="mb-4 flex flex-wrap gap-2">
        <FilterPill label="Date range" value={range} options={["Jan 2026 – Jun 2026", "Apr 2026 – Jun 2026", "Jun 2026"]} onChange={setRange} />
        <FilterPill label="Category" value={category} options={["All categories", ...REJECTION_CATEGORIES]} onChange={setCategory} />
        <FilterPill label="Claim value" value={band} options={["All claim values", "Below ₹50,000", "₹50,000 – ₹2,00,000", "Above ₹2,00,000"]} onChange={setBand} />
        <FilterPill label="Insurer" value={insurer} options={["All insurers", ...INSURERS]} onChange={setInsurer} />
      </div>

      <Panel title="Rejection reason by month">
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={REASON_BY_MONTH}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
            <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
            <Tooltip {...tip} />
            {CATEGORY_STATS.map((c, i) => (
              <Bar key={c.short} dataKey={c.short} stackId="a" fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          {CATEGORY_STATS.map((c, i) => (
            <li key={c.short} className="flex items-center gap-1.5">
              <span className="size-2 rounded-sm" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
              {c.short}
            </li>
          ))}
        </ul>
      </Panel>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Comprehension Confirmed Rate by category">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={CATEGORY_STATS} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" unit="%" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis type="category" dataKey="short" width={130} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <Tooltip {...tip} />
              <Bar dataKey="comprehension" name="Comprehension confirmed %" fill="var(--success)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
        <Panel title="Distress Rate by category">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={CATEGORY_STATS} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" unit="%" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis type="category" dataKey="short" width={130} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <Tooltip {...tip} />
              <Bar dataKey="distressRate" name="Distress rate %" fill="var(--danger)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel title="Category detail" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="label-caps pb-2 text-muted-foreground">Rejection category</th>
                <th className="label-caps pb-2 text-right text-muted-foreground">Call volume</th>
                <th className="label-caps pb-2 text-right text-muted-foreground">Avg value communicated</th>
                <th className="label-caps pb-2 text-right text-muted-foreground">Appeal guidance given</th>
                <th className="label-caps pb-2 text-right text-muted-foreground">Grievance flagged</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.category} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 text-foreground">{c.category}</td>
                  <td className="py-2.5 text-right text-foreground">{c.volume.toLocaleString("en-IN")}</td>
                  <td className="py-2.5 text-right text-foreground">{formatINR(c.avgValue)}</td>
                  <td className="py-2.5 text-right text-foreground">{c.appealRate}%</td>
                  <td className="py-2.5 text-right text-foreground">{c.grievanceRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AppShell>
  );
}
