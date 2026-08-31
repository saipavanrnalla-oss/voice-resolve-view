import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AnomalyBanner, PageHeader, Panel, StatusPill } from "@/components/kit";
import { CHANNELS } from "@/lib/mock-analytics";

export const Route = createFileRoute("/channel-observability")({
  head: () => ({
    meta: [
      { title: "Channel Observability | ArogyaLink TPA" },
      { name: "description", content: "Voice, SMS, WhatsApp and Email channel status, latency, success rate and volume for rejection call outreach." },
      { property: "og:title", content: "Channel Observability — ArogyaLink TPA" },
      { property: "og:description", content: "Channel health for the rejection-call outreach cascade." },
    ],
  }),
  component: ChannelObservability,
});

function ChannelObservability() {
  return (
    <AppShell crumb="Channel Observability">
      <PageHeader title="Channel Observability" subtitle="ArogyaLink TPA · last 24 hours" />

      <AnomalyBanner
        headline="WhatsApp channel degraded"
        detail="Median send latency 6.8 s and success rate 82.3%, below the 95% floor, since 08:20 on 20 Jun 2026."
      />

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {CHANNELS.map((c) => (
          <Panel key={c.name} title={c.name} action={<StatusPill status={c.status} />}>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="label-caps text-muted-foreground">Median latency</dt>
                <dd className="text-lg font-semibold text-foreground">{c.latency}</dd>
              </div>
              <div>
                <dt className="label-caps text-muted-foreground">Success rate</dt>
                <dd className="text-lg font-semibold text-foreground">{c.success}%</dd>
              </div>
              <div>
                <dt className="label-caps text-muted-foreground">Volume today</dt>
                <dd className="text-lg font-semibold text-foreground">{c.volume.toLocaleString("en-IN")}</dd>
              </div>
            </dl>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${c.success}%`,
                  background: c.success >= 95 ? "var(--success)" : "var(--warning)",
                }}
              />
            </div>
          </Panel>
        ))}
      </div>

      <Panel title="Escalation cascade order" className="mt-4">
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {["Voice", "SMS", "WhatsApp", "Email"].map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span className="rounded-lg border border-border bg-muted px-3 py-1.5 font-medium text-foreground">{s}</span>
              {i < 3 && <span className="text-muted-foreground">→</span>}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-muted-foreground">
          Attempts capped at 3 per claimant per day, placed inside the 9 AM – 7 PM calling window configured for this demo.
        </p>
      </Panel>
    </AppShell>
  );
}
