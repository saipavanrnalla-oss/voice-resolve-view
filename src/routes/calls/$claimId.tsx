import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Check, Play, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PageHeader, Panel, StatusPill } from "@/components/kit";
import { BASE_PHASES, CallFlow, type CallPhase } from "@/components/CallFlow";
import { claimById, formatINR } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calls/$claimId")({
  validateSearch: (s: Record<string, unknown>) => ({ play: Number(s['play']) === 1 ? 1 : 0 }),
  head: ({ params }) => {
    const c = claimById(params.claimId);
    const title = c ? `${c.id} — ${c.claimant} | Call Detail` : "Call Detail | ArogyaLink TPA";
    const description = c
      ? `${c.category} rejection call for ${c.claimant}, ${formatINR(c.value)} — terminal state ${c.terminalState}.`
      : "Rejection call detail for ArogyaLink TPA.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CallDetail,
  errorComponent: ({ error }) => <div role="alert" className="p-8">{error.message}</div>,
  notFoundComponent: () => <div className="p-8">Claim not found.</div>,
});

const TABS = ["Overview", "Transcript", "Disposition & QA"] as const;

function CallDetail() {
  const { claimId } = Route.useParams();
  const { play } = Route.useSearch();
  const claim = claimById(claimId);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [phases, setPhases] = useState<CallPhase[]>(BASE_PHASES.map((p) => ({ ...p, status: "done" })));
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const canPlay = !!claim?.playback;

  const runPlayback = () => {
    if (!claim) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(true);
    setLog([]);
    setPhases(BASE_PHASES.map((p) => ({ ...p, status: "idle" })));

    const lines = [
      "Claims Data Sync Agent: rejection reason and policy clause pulled.",
      `Voice Agent: outbound call placed to ${claim.claimant}.`,
      "Channel Orchestrator: connected on Voice, no fallback required.",
      "Voice Agent: rejection reason stated with policy clause reference.",
      "Sentiment Agent: distress score rising during reason explanation.",
      "Voice Agent: comprehension-confirmation question asked.",
      "Next-Step Agent: branch selected from the claimant's spoken response.",
      `Disposition Agent: terminal state assigned — ${claim.terminalState}.`,
    ];
    const phaseOfLine = [0, 1, 1, 2, 2, 2, 3, 4];

    lines.forEach((line, i) => {
      const delay = 300 + i * 820;
      timers.current.push(
        setTimeout(() => {
          setLog((l) => [...l, line]);
          setPhases((prev) =>
            prev.map((p, pi) => ({
              ...p,
              status: pi < phaseOfLine[i]! ? "done" : pi === phaseOfLine[i] ? "active" : "idle",
            })),
          );
        }, delay),
      );
    });
    timers.current.push(
      setTimeout(
        () => {
          setPhases(BASE_PHASES.map((p) => ({ ...p, status: "done" })));
          setRunning(false);
        },
        300 + lines.length * 820,
      ),
    );
  };

  useEffect(() => {
    if (play === 1 && canPlay) runPlayback();
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claimId, play]);

  if (!claim) {
    return (
      <AppShell crumb="Call Detail">
        <p className="text-sm text-muted-foreground">Claim not found.</p>
      </AppShell>
    );
  }

  return (
    <AppShell crumb={`Call Detail · ${claim.id}`}>
      <PageHeader
        title={`${claim.id} — ${claim.claimant}`}
        subtitle={`${claim.category} · ${formatINR(claim.value)} · ${claim.callDate}`}
        right={
          <div className="flex items-center gap-3">
            <StatusPill status={claim.terminalState} />
            {canPlay && (
              <button
                onClick={runPlayback}
                disabled={running}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-dark disabled:opacity-60"
              >
                <Play className="size-4" />
                {running ? "Playback running" : "Run live call playback"}
              </button>
            )}
          </div>
        }
      />

      <Panel title="Call journey">
        <CallFlow phases={phases} />
        {log.length > 0 && (
          <ul className="mt-3 max-h-40 space-y-1 overflow-y-auto rounded-lg bg-muted p-3 text-xs text-foreground">
            {log.map((l, i) => (
              <li key={i} className="font-mono">
                {l}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div className="mt-4 flex gap-1 rounded-lg border border-border bg-card p-1 text-sm">
        {TABS.map((t) => (
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

      {tab === "Overview" && <Overview claim={claim} />}
      {tab === "Transcript" && <Transcript claim={claim} />}
      {tab === "Disposition & QA" && <Disposition claim={claim} />}
    </AppShell>
  );
}

type Claim = NonNullable<ReturnType<typeof claimById>>;

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-border/60 py-2 last:border-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium text-foreground">{v}</dd>
    </div>
  );
}

function Overview({ claim }: { claim: Claim }) {
  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-3">
      <Panel title="Claimant">
        <dl className="text-sm">
          <Row k="Name" v={claim.claimant} />
          <Row k="Age" v={`${claim.age}`} />
          <Row k="Location" v={`${claim.city}, ${claim.state}`} />
          <Row k="Policy number" v={claim.policyNumber} />
          <Row k="Communication preference" v={claim.commsPreference} />
        </dl>
        <Link
          to="/claimant-360"
          search={{ claimant: claim.claimant }}
          className="mt-3 inline-block text-sm font-medium text-primary"
        >
          Open Claimant 360
        </Link>
      </Panel>

      <Panel title="Claim">
        <dl className="text-sm">
          <Row k="Treatment" v={claim.treatment} />
          <Row k="Hospital" v={claim.hospital} />
          <Row k="TPA" v="ArogyaLink TPA" />
          <Row k="Insurer" v={claim.insurer} />
          <Row k="Claim value" v={formatINR(claim.value)} />
          <Row k="Rejection reason" v={claim.category} />
          <Row k="Policy clause" v={claim.clause} />
        </dl>
      </Panel>

      <Panel title="Call timeline">
        <ol className="space-y-3">
          {claim.timeline.map((t) => (
            <li key={t.label + t.time} className="flex gap-3">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.time}</p>
              </div>
            </li>
          ))}
        </ol>
        <dl className="mt-4 text-sm">
          <Row k="Attempts" v={`${claim.attempts}`} />
          <Row k="Channel reached" v={claim.channel} />
          <Row k="Duration" v={claim.durationSec ? `${Math.floor(claim.durationSec / 60)}m ${claim.durationSec % 60}s` : "—"} />
        </dl>
      </Panel>

      <Panel title="Next-step guidance given on the call" className="xl:col-span-3">
        <ul className="space-y-2 text-sm">
          {claim.nextStepGuidance.map((g) => (
            <li key={g} className="flex gap-2 text-foreground">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              {g}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function Transcript({ claim }: { claim: Claim }) {
  const sentiment = claim.transcript.map((t) => ({ t: t.t, score: t.sentiment }));
  return (
    <div className="mt-4 grid gap-4">
      <Panel title={`Transcript · ${claim.callDate} ${claim.callTime}`}>
        <ul className="space-y-3">
          {claim.transcript.map((turn, i) => (
            <li key={i} className={cn("flex", turn.speaker === "Claimant" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[72%]", turn.speaker === "Claimant" && "text-right")}>
                <p className="mb-1 text-[11px] text-muted-foreground">
                  {turn.t} · {turn.speaker}
                </p>
                <div
                  className={cn(
                    "rounded-xl px-3.5 py-2.5 text-sm",
                    turn.speaker === "Claimant"
                      ? "bg-muted text-foreground"
                      : "bg-primary/8 border border-primary/20 text-foreground",
                  )}
                >
                  {turn.text}
                </div>
                {turn.marker && (
                  <span
                    className={cn(
                      "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                      turn.marker === "Distress spike" ? "bg-danger-soft text-danger" : "bg-info-soft text-info",
                    )}
                  >
                    {turn.marker}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Sentiment across call duration">
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={sentiment}>
            <XAxis dataKey="t" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }} />
            <Line type="monotone" dataKey="score" name="Sentiment score" stroke="var(--primary)" strokeWidth={2} dot={{ r: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </Panel>
    </div>
  );
}

function CheckRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      {ok ? <Check className="size-4 text-success" /> : <X className="size-4 text-danger" />}
      <span className="text-foreground">{label}</span>
    </li>
  );
}

function Disposition({ claim }: { claim: Claim }) {
  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-2">
      <Panel title="Disposition">
        <dl className="text-sm">
          <Row k="Terminal state" v={claim.terminalState} />
          <Row k="Sub-remark" v={claim.subRemark} />
          <Row k="Distress level" v={`${claim.distress} · ${claim.distressScore}`} />
        </dl>
        <div className="mt-3 flex flex-wrap gap-2">
          {claim.qaTags.length === 0 ? (
            <StatusPill status="No QA failure tags" />
          ) : (
            claim.qaTags.map((t) => (
              <span key={t} className="rounded-full bg-danger-soft px-2.5 py-0.5 text-xs font-medium text-danger">
                {t}
              </span>
            ))
          )}
        </div>
      </Panel>

      <Panel title="Rejection reason accuracy">
        <dl className="text-sm">
          <Row k="Reason stated on call" v={claim.category} />
          <Row k="System ground truth" v={claim.category} />
        </dl>
        <div className="mt-3">
          <StatusPill status={claim.reasonAccuracy === "Match" ? "Match" : "Mismatch — stated reason differs"} />
        </div>
      </Panel>

      <Panel title="Disclosure adherence">
        <ul className="space-y-2">
          <CheckRow ok={claim.disclosures.recording} label="Recording disclosure given" />
          <CheckRow ok={claim.disclosures.clauseCited} label="Policy clause cited" />
          <CheckRow ok={claim.disclosures.rightToDispute} label="Right to dispute mentioned" />
        </ul>
      </Panel>

      <Panel title="Prohibited language scan">
        {claim.prohibitedLanguage ? (
          <div className="rounded-lg border border-danger/25 bg-danger-soft p-3 text-sm text-foreground">
            {claim.prohibitedLanguage}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No prohibited language detected across {claim.transcript.length} turns.</p>
        )}
      </Panel>
    </div>
  );
}
