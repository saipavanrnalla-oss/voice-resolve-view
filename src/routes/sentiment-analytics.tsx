import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell } from "@/components/AppShell";
import { CHART_COLORS, PageHeader, Panel, StatCard } from "@/components/kit";
import { CATEGORY_STATS, DISTRESS_TREND, SENTIMENT_DISTRIBUTION, TRAJECTORY } from "@/lib/mock-analytics";

export const Route = createFileRoute("/sentiment-analytics")({
  head: () => ({
    meta: [
      { title: "Sentiment & Distress Analytics | ArogyaLink TPA" },
      { name: "description", content: "Distress rates, sentiment distribution and in-call sentiment trajectories across claim rejection calls." },
      { property: "og:title", content: "Sentiment & Distress Analytics — ArogyaLink TPA" },
      { property: "og:description", content: "Call-derived sentiment scoring across rejection categories for ArogyaLink TPA." },
    ],
  }),
  component: SentimentAnalytics,
});

const tip = { contentStyle: { borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 } };
const SENTIMENT_TONES = ["var(--success)", "var(--info)", "var(--warning)", "var(--danger)"];

function SentimentAnalytics() {
  return (
    <AppShell crumb="Sentiment & Distress Analytics">
      <PageHeader title="Sentiment & Distress Analytics" subtitle="ArogyaLink TPA · Jun 2026" />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Distress Rate" value="35.0%" sublabel="calls reaching Distressed or worse" tone="warning" trend={{ dir: "down", text: "2.4 pts", good: true }} />
        <StatCard label="Angry Segment" value="11.0%" sublabel="of connected calls" tone="danger" trend={{ dir: "up", text: "0.7 pts", good: false }} />
        <StatCard label="De-escalated by Call End" value="19.0%" sublabel="started negative, ended calmer" tone="success" trend={{ dir: "up", text: "1.9 pts" }} />
        <StatCard label="Negative Shift Mid-Call" value="28.0%" sublabel="started calm, shifted negative" tone="info" trend={{ dir: "down", text: "1.1 pts", good: true }} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Distress rate trend — last 12 weeks" className="xl:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={DISTRESS_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis unit="%" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <Tooltip {...tip} />
              <Line type="monotone" dataKey="distressRate" name="Distress rate %" stroke="var(--primary)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Sentiment distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={SENTIMENT_DISTRIBUTION} dataKey="value" nameKey="name" innerRadius={54} outerRadius={96} paddingAngle={1}>
                {SENTIMENT_DISTRIBUTION.map((_, i) => (
                  <Cell key={i} fill={SENTIMENT_TONES[i]} />
                ))}
              </Pie>
              <Tooltip {...tip} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            {SENTIMENT_DISTRIBUTION.map((s, i) => (
              <li key={s.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-sm" style={{ background: SENTIMENT_TONES[i] }} />
                  {s.name}
                </span>
                <span>{s.value}%</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Panel title="Distress rate by rejection category">
          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={[...CATEGORY_STATS].sort((a, b) => b.distressRate - a.distressRate)} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" unit="%" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis type="category" dataKey="short" width={130} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <Tooltip {...tip} />
              <Bar dataKey="distressRate" name="Distress rate %" radius={[0, 4, 4, 0]}>
                {CATEGORY_STATS.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Distress trajectory shape">
          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={TRAJECTORY} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" unit="%" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis type="category" dataKey="name" width={200} tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
              <Tooltip {...tip} />
              <Bar dataKey="value" name="% of calls" radius={[0, 4, 4, 0]}>
                {TRAJECTORY.map((_, i) => (
                  <Cell key={i} fill={["var(--warning)", "var(--success)", "var(--info)", "var(--danger)"][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </AppShell>
  );
}
