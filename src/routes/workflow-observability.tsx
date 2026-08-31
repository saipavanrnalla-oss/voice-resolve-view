import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AnomalyBanner, DropOffFunnel, PageHeader, Panel, StatusPill } from "@/components/kit";
import { INSTANCES, WORKFLOWS } from "@/lib/mock-analytics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/workflow-observability")({
  head: () => ({
    meta: [
      { title: "Workflow Observability | ArogyaLink TPA" },
      { name: "description", content: "Per-workflow completion rates, drop-off funnels and individual call run instances for claim rejection outreach." },
      { property: "og:title", content: "Workflow Observability — ArogyaLink TPA" },
      { property: "og:description", content: "Active instances, completion rate, average time and cost per rejection-call workflow." },
    ],
  }),
  component: WorkflowObservability,
});

const FUNNEL_LABELS = ["Queued", "Attempted", "Connected", "Explained", "Terminal"];

function WorkflowObservability() {
  const [tab, setTab] = useState<"Aggregate" | "Instance View">("Aggregate");
  return (
    <AppShell crumb="Workflow Observability">
      <PageHeader title="Workflow Observability" subtitle="ArogyaLink TPA · last 7 days" />

      <AnomalyBanner
        headline="Retry & Channel Escalation Cascade completion below threshold"
        detail="Completion at 71.5% against an 85% floor; drop-off concentrated at the Voice → WhatsApp handoff step."
      />

      <div className="my-4 flex gap-1 rounded-lg border border-border bg-card p-1 text-sm">
        {(["Aggregate", "Instance View"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-md px-3.5 py-1.5 font-medium transition-colors",
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Aggregate" ? (
        <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {WORKFLOWS.map((w) => (
            <Panel key={w.name} title={w.name} action={<StatusPill status={w.status} />}>
              <dl className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <dt className="label-caps text-muted-foreground">Active instances</dt>
                  <dd className="text-lg font-semibold text-foreground">{w.active}</dd>
                </div>
                <div>
                  <dt className="label-caps text-muted-foreground">Completion rate</dt>
                  <dd className="text-lg font-semibold text-foreground">{w.completion}%</dd>
                </div>
                <div>
                  <dt className="label-caps text-muted-foreground">Avg time</dt>
                  <dd className="text-lg font-semibold text-foreground">{w.avgTime}</dd>
                </div>
                <div>
                  <dt className="label-caps text-muted-foreground">Cost (7d)</dt>
                  <dd className="text-lg font-semibold text-foreground">{w.cost}</dd>
                </div>
              </dl>
              <div className="mt-4">
                <DropOffFunnel steps={w.funnel} labels={FUNNEL_LABELS} />
              </div>
            </Panel>
          ))}
        </div>
      ) : (
        <Panel title="Call run instances">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="label-caps pb-2 text-muted-foreground">Claim ID</th>
                  <th className="label-caps pb-2 text-muted-foreground">Workflow</th>
                  <th className="label-caps pb-2 text-muted-foreground">Current phase</th>
                  <th className="label-caps pb-2 text-muted-foreground">Status</th>
                  <th className="label-caps pb-2 text-right text-muted-foreground">Duration</th>
                </tr>
              </thead>
              <tbody>
                {INSTANCES.map((i) => (
                  <tr key={i.claim + i.workflow} className="border-b border-border/60 last:border-0">
                    <td className="py-2.5 font-medium text-foreground">{i.claim}</td>
                    <td className="py-2.5 text-foreground">{i.workflow}</td>
                    <td className="py-2.5 text-muted-foreground">{i.phase}</td>
                    <td className="py-2.5">
                      <StatusPill status={i.status} />
                    </td>
                    <td className="py-2.5 text-right text-foreground">{i.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </AppShell>
  );
}
