import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { FilterPill, PageHeader, Panel, StatusPill, distressTone } from "@/components/kit";
import { ALL_CLAIMS, CATEGORY_SHORT, REJECTION_CATEGORIES, TERMINAL_STATES, formatINR } from "@/lib/mock-data";
import type { Claim } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calls/")({
  head: () => ({
    meta: [
      { title: "Call Log | ArogyaLink TPA Claims Resolution" },
      { name: "description", content: "Read-only log of claim rejection calls with rejection category, claim value, terminal state and distress level." },
      { property: "og:title", content: "Call Log — ArogyaLink TPA Claims Resolution" },
      { property: "og:description", content: "Every rejection call with its recorded terminal state and distress level." },
    ],
  }),
  component: CallLog,
});

type SortKey = "id" | "claimant" | "category" | "value" | "terminalState" | "callDate" | "distressScore";

function CallLog() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All categories");
  const [terminal, setTerminal] = useState("All terminal states");
  const [distress, setDistress] = useState("All distress levels");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "callDate", dir: -1 });

  const rows = useMemo(() => {
    let r = ALL_CLAIMS.filter(
      (c) =>
        (category === "All categories" || c.category === category) &&
        (terminal === "All terminal states" || c.terminalState === terminal) &&
        (distress === "All distress levels" || c.distress === distress),
    );
    r = [...r].sort((a, b) => {
      const av = a[sort.key as keyof Claim] as string | number;
      const bv = b[sort.key as keyof Claim] as string | number;
      return (av > bv ? 1 : av < bv ? -1 : 0) * sort.dir;
    });
    return r;
  }, [category, terminal, distress, sort]);

  const th = (key: SortKey, label: string, align: "left" | "right" = "left") => (
    <th className={cn("label-caps pb-2 text-muted-foreground", align === "right" && "text-right")}>
      <button
        className="inline-flex items-center gap-1"
        onClick={() => setSort((s) => ({ key, dir: s.key === key && s.dir === 1 ? -1 : 1 }))}
      >
        {label}
        <ArrowUpDown className={cn("size-3", sort.key === key ? "text-primary" : "text-muted-foreground/50")} />
      </button>
    </th>
  );

  return (
    <AppShell crumb="Call Log">
      <PageHeader title="Call Log" subtitle={`ArogyaLink TPA · ${rows.length} calls`} />

      <div className="mb-4 flex flex-wrap gap-2">
        <FilterPill label="Category" value={category} options={["All categories", ...REJECTION_CATEGORIES]} onChange={setCategory} />
        <FilterPill label="Terminal state" value={terminal} options={["All terminal states", ...TERMINAL_STATES]} onChange={setTerminal} />
        <FilterPill label="Distress" value={distress} options={["All distress levels", "Calm", "Concerned", "Distressed", "Angry"]} onChange={setDistress} />
      </div>

      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {th("id", "Claim ID")}
                {th("claimant", "Claimant")}
                {th("category", "Rejection category")}
                {th("value", "Value", "right")}
                {th("terminalState", "Terminal state")}
                {th("callDate", "Call date")}
                {th("distressScore", "Distress", "right")}
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => navigate({ to: "/calls/$claimId", params: { claimId: c.id }, search: { play: 0 } })}
                  className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-muted"
                >
                  <td className="py-2.5 font-medium text-primary">{c.id}</td>
                  <td className="py-2.5 text-foreground">{c.claimant}</td>
                  <td className="py-2.5 text-foreground">{CATEGORY_SHORT[c.category]}</td>
                  <td className="py-2.5 text-right text-foreground">{formatINR(c.value)}</td>
                  <td className="py-2.5">
                    <StatusPill status={c.terminalState} />
                  </td>
                  <td className="py-2.5 whitespace-nowrap text-muted-foreground">
                    {c.callDate} · {c.callTime}
                  </td>
                  <td className="py-2.5 text-right">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        distressTone(c.distress) === "success" && "bg-success-soft text-success",
                        distressTone(c.distress) === "info" && "bg-info-soft text-info",
                        distressTone(c.distress) === "warning" && "bg-warning-soft text-warning",
                        distressTone(c.distress) === "danger" && "bg-danger-soft text-danger",
                      )}
                    >
                      {c.distress} · {c.distressScore}
                    </span>
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
