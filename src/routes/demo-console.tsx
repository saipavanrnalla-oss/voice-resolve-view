import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Panel } from "@/components/kit";
import { FLAGSHIP, INSURERS, REJECTION_CATEGORIES, claimById } from "@/lib/mock-data";

export const Route = createFileRoute("/demo-console")({
  head: () => ({
    meta: [
      { title: "Demo Console | ArogyaLink TPA Claims Resolution" },
      { name: "description", content: "Select an insurer client and rejection category, then load the matching sample rejection call." },
      { property: "og:title", content: "Demo Console — ArogyaLink TPA Claims Resolution" },
      { property: "og:description", content: "Load a sample claim rejection call for a chosen insurer and rejection category." },
    ],
  }),
  component: DemoConsole,
});

function DemoConsole() {
  const navigate = useNavigate();
  const [insurer, setInsurer] = useState<string>(INSURERS[0]);
  const [category, setCategory] = useState<string>(REJECTION_CATEGORIES[5]);
  const claimId = FLAGSHIP[category];
  const claim = claimById(claimId);

  return (
    <AppShell crumb="Demo Console">
      <PageHeader title="Demo Console" subtitle="ArogyaLink TPA · demo environment" />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Sample call selection" className="lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="label-caps text-muted-foreground">Insurer Client</span>
              <select
                value={insurer}
                onChange={(e) => setInsurer(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              >
                {INSURERS.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="label-caps text-muted-foreground">Rejection Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              >
                {REJECTION_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>

          <button
            onClick={() =>
              navigate({
                to: "/calls/$claimId",
                params: { claimId },
                search: { play: claim?.playback ? 1 : 0 },
              })
            }
            className="mt-5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-dark"
          >
            Load Sample Call
          </button>
        </Panel>

        <Panel title="Selected call">
          {claim && (
            <dl className="space-y-2.5 text-sm">
              <Row k="Claim ID" v={claim.id} />
              <Row k="Claimant" v={`${claim.claimant}, ${claim.age}`} />
              <Row k="Treatment" v={claim.treatment} />
              <Row k="Insurer (demo)" v={insurer} />
              <Row k="Terminal state" v={claim.terminalState} />
              <Row k="Live playback" v={claim.playback ? "Available" : "Static record"} />
            </dl>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium text-foreground">{v}</dd>
    </div>
  );
}
