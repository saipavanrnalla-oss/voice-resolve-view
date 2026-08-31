import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Panel, StatusPill } from "@/components/kit";
import { ALL_CLAIMS, formatINR } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/claimant-360")({
  validateSearch: (s: Record<string, unknown>) => ({
    claimant: typeof s.claimant === "string" ? s.claimant : "Anjali Verma",
  }),
  head: () => ({
    meta: [
      { title: "Claimant 360 | ArogyaLink TPA" },
      { name: "description", content: "Claimant profile, claim history and past rejection-call outcomes with call-derived pattern tags." },
      { property: "og:title", content: "Claimant 360 — ArogyaLink TPA" },
      { property: "og:description", content: "Full call history and claim record for a single claimant." },
    ],
  }),
  component: Claimant360,
});

const EXTRA_HISTORY: Record<string, { id: string; treatment: string; value: number; outcome: string; date: string }[]> = {
  "Anjali Verma": [
    { id: "CLM-H09877", treatment: "Dental extraction", value: 12400, outcome: "Settled in full", date: "18 Nov 2025" },
  ],
  "Rajeev Menon": [
    { id: "CLM-H09241", treatment: "Cardiac consultation package", value: 24600, outcome: "Settled in full", date: "04 Aug 2025" },
    { id: "CLM-H09702", treatment: "Stress test and imaging", value: 38900, outcome: "Partially settled", date: "22 Oct 2025" },
  ],
};

function Claimant360() {
  const { claimant } = Route.useSearch();
  const names = Array.from(new Set(ALL_CLAIMS.map((c) => c.claimant)));
  const calls = ALL_CLAIMS.filter((c) => c.claimant === claimant);
  const profile = calls[0] ?? ALL_CLAIMS[0];
  const history = EXTRA_HISTORY[claimant] ?? [];

  const tags: string[] = [];
  if (calls.length + history.length > 1) tags.push("Repeat rejection contact");
  if (calls.every((c) => c.distressScore >= 60) && calls.length > 0) tags.push("Elevated distress across recent calls");
  if (calls.some((c) => c.terminalState === "Grievance Flagged")) tags.push("Dispute raised on a prior call");
  if (calls.some((c) => c.attempts >= 3)) tags.push("Low voice reachability");
  if (calls.some((c) => c.vulnerabilityFlag)) tags.push("Vulnerability flagged on call");

  return (
    <AppShell crumb="Claimant 360">
      <PageHeader
        title="Claimant 360"
        subtitle={`ArogyaLink TPA · ${claimant}`}
        right={
          <label className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
            <span className="label-caps text-muted-foreground">Claimant</span>
            <select
              value={claimant}
              onChange={(e) => {
                window.location.href = `/claimant-360?claimant=${encodeURIComponent(e.target.value)}`;
              }}
              className="bg-transparent text-xs font-medium text-foreground outline-none"
            >
              {names.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </label>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <Panel title="Profile">
          <dl className="text-sm">
            {[
              ["Name", profile.claimant],
              ["Age", `${profile.age}`],
              ["Policy number", profile.policyNumber],
              ["TPA", "ArogyaLink TPA"],
              ["Insurer", profile.insurer],
              ["Communication preference", profile.commsPreference],
              ["Location", `${profile.city}, ${profile.state}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-border/60 py-2 last:border-0">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {t}
              </span>
            ))}
          </div>
        </Panel>

        <Panel title="Claim history" className="xl:col-span-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="label-caps pb-2 text-muted-foreground">Claim ID</th>
                <th className="label-caps pb-2 text-muted-foreground">Treatment</th>
                <th className="label-caps pb-2 text-right text-muted-foreground">Value</th>
                <th className="label-caps pb-2 text-muted-foreground">Outcome</th>
                <th className="label-caps pb-2 text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {calls.map((c) => (
                <tr key={c.id} className="border-b border-border/60">
                  <td className="py-2.5 font-medium text-foreground">{c.id}</td>
                  <td className="py-2.5 text-foreground">{c.treatment}</td>
                  <td className="py-2.5 text-right text-foreground">{formatINR(c.value)}</td>
                  <td className="py-2.5 text-foreground">Rejected — {c.category}</td>
                  <td className="py-2.5 whitespace-nowrap text-muted-foreground">{c.callDate}</td>
                </tr>
              ))}
              {history.map((h) => (
                <tr key={h.id} className="border-b border-border/60 last:border-0">
                  <td className="py-2.5 font-medium text-foreground">{h.id}</td>
                  <td className="py-2.5 text-foreground">{h.treatment}</td>
                  <td className="py-2.5 text-right text-foreground">{formatINR(h.value)}</td>
                  <td className="py-2.5 text-foreground">{h.outcome}</td>
                  <td className="py-2.5 whitespace-nowrap text-muted-foreground">{h.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <Panel title="Past call log" className="mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="label-caps pb-2 text-muted-foreground">Claim</th>
              <th className="label-caps pb-2 text-muted-foreground">Terminal state</th>
              <th className="label-caps pb-2 text-muted-foreground">Sub-remark</th>
              <th className="label-caps pb-2 text-muted-foreground">Date</th>
              <th className="label-caps pb-2 text-right text-muted-foreground">Distress</th>
            </tr>
          </thead>
          <tbody>
            {calls.map((c) => (
              <tr key={c.id} className="border-b border-border/60 last:border-0">
                <td className="py-2.5">
                  <Link to="/calls/$claimId" params={{ claimId: c.id }} search={{ play: 0 }} className="font-medium text-primary">
                    {c.id}
                  </Link>
                </td>
                <td className="py-2.5">
                  <StatusPill status={c.terminalState} />
                </td>
                <td className="py-2.5 text-foreground">{c.subRemark}</td>
                <td className="py-2.5 whitespace-nowrap text-muted-foreground">
                  {c.callDate} · {c.callTime}
                </td>
                <td className={cn("py-2.5 text-right font-medium", c.distressScore >= 70 ? "text-danger" : "text-foreground")}>
                  {c.distress} · {c.distressScore}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </AppShell>
  );
}
