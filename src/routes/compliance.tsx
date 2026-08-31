import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Panel, StatCard, StatusPill } from "@/components/kit";
import { ALL_CLAIMS } from "@/lib/mock-data";

export const Route = createFileRoute("/compliance")({
  head: () => ({
    meta: [
      { title: "Compliance & QA Console | ArogyaLink TPA" },
      { name: "description", content: "Call-derived QA: terminal state match, disclosure adherence, prohibited language scan, calling-window and max-attempt compliance." },
      { property: "og:title", content: "Compliance & QA Console — ArogyaLink TPA" },
      { property: "og:description", content: "QA review results across sampled claim rejection calls." },
    ],
  }),
  component: Compliance,
});

const FAILURE_MIX = [
  { name: "FLOW ISSUE", value: 61 },
  { name: "CLASSIFIER ISSUE", value: 39 },
];

function Compliance() {
  const [query, setQuery] = useState("");
  const rows = useMemo(
    () =>
      ALL_CLAIMS.filter((c) =>
        [c.id, c.claimant, c.terminalState, c.qaTags.join(" ")].join(" ").toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );
  const mismatches = ALL_CLAIMS.filter((c) => c.reasonAccuracy === "Mismatch");
  const prohibited = ALL_CLAIMS.filter((c) => c.prohibitedLanguage);

  return (
    <AppShell crumb="Compliance & QA Console">
      <PageHeader title="Compliance & QA Console" subtitle="ArogyaLink TPA · 480 calls sampled, Jun 2026" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Terminal State Match Rate" value="94.6%" sublabel="454 of 480 sampled calls" tone="success" trend={{ dir: "up", text: "1.2 pts" }} />
        <StatCard label="Sub-Remark Match Rate" value="89.2%" sublabel="428 of 480 sampled calls" tone="info" trend={{ dir: "up", text: "0.6 pts" }} />
        <StatCard label="Disclosure Adherence Rate" value="97.1%" sublabel="all three disclosures said" tone="success" trend={{ dir: "down", text: "0.4 pts", good: false }} />
        <StatCard label="Calling-Window Compliance" value="99.6%" sublabel="placed within 9 AM – 7 PM (demo value)" tone="success" trend={{ dir: "up", text: "0.2 pts" }} />
        <StatCard label="Max-Attempt Compliance" value="99.8%" sublabel="within 3 attempts per claimant per day" tone="success" trend={{ dir: "up", text: "0.1 pts" }} />
        <StatCard label="Prohibited Language Hits" value="6" sublabel="flagged instances this month" tone="danger" trend={{ dir: "down", text: "3 fewer", good: true }} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="QA failure tag breakdown">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={FAILURE_MIX} dataKey="value" nameKey="name" innerRadius={54} outerRadius={90}>
                {FAILURE_MIX.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "var(--primary)" : "var(--info)"} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="space-y-1 text-xs text-muted-foreground">
            {FAILURE_MIX.map((f, i) => (
              <li key={f.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-sm" style={{ background: i === 0 ? "var(--primary)" : "var(--info)" }} />
                  {f.name}
                </span>
                <span>{f.value}%</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Rejection reason accuracy">
          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-semibold text-foreground">96.9%</p>
            <p className="text-sm text-muted-foreground">stated reason matched system ground truth</p>
          </div>
          <p className="mt-4 label-caps text-muted-foreground">Mismatched calls</p>
          <ul className="mt-2 space-y-2">
            {mismatches.map((c) => (
              <li key={c.id} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
                <Link to="/calls/$claimId" params={{ claimId: c.id }} search={{ play: 0 }} className="font-medium text-primary">
                  {c.id}
                </Link>
                <span className="text-muted-foreground">{c.claimant}</span>
                <StatusPill status="Mismatch" />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Prohibited language scan">
          <ul className="space-y-3">
            {prohibited.map((c) => (
              <li key={c.id} className="rounded-lg border border-danger/25 bg-danger-soft p-3 text-sm">
                <p className="text-foreground">{c.prohibitedLanguage}</p>
                <Link
                  to="/calls/$claimId"
                  params={{ claimId: c.id }}
                  search={{ play: 0 }}
                  className="mt-1.5 inline-block text-xs font-medium text-primary"
                >
                  {c.id} · open transcript
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="QA review log"
        className="mt-4"
        action={
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search claim, claimant, terminal state, tag"
            className="w-64 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
          />
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="label-caps pb-2 text-muted-foreground">Timestamp</th>
                <th className="label-caps pb-2 text-muted-foreground">Claim</th>
                <th className="label-caps pb-2 text-muted-foreground">Terminal state</th>
                <th className="label-caps pb-2 text-muted-foreground">Sub-remark</th>
                <th className="label-caps pb-2 text-muted-foreground">QA flags</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 whitespace-nowrap text-muted-foreground">
                    {c.callDate} · {c.callTime}
                  </td>
                  <td className="py-2.5">
                    <Link to="/calls/$claimId" params={{ claimId: c.id }} search={{ play: 0 }} className="font-medium text-primary">
                      {c.id}
                    </Link>
                  </td>
                  <td className="py-2.5">
                    <StatusPill status={c.terminalState} />
                  </td>
                  <td className="py-2.5 text-foreground">{c.subRemark}</td>
                  <td className="py-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      {c.qaTags.length === 0 && !c.prohibitedLanguage && c.reasonAccuracy === "Match" ? (
                        <span className="text-xs text-muted-foreground">None</span>
                      ) : (
                        <>
                          {c.qaTags.map((t) => (
                            <span key={t} className="rounded-full bg-danger-soft px-2 py-0.5 text-[11px] font-medium text-danger">
                              {t}
                            </span>
                          ))}
                          {c.reasonAccuracy === "Mismatch" && (
                            <span className="rounded-full bg-warning-soft px-2 py-0.5 text-[11px] font-medium text-warning">
                              REASON MISMATCH
                            </span>
                          )}
                          {c.prohibitedLanguage && (
                            <span className="rounded-full bg-danger-soft px-2 py-0.5 text-[11px] font-medium text-danger">
                              PROHIBITED LANGUAGE
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </AppShell>
  );
}
