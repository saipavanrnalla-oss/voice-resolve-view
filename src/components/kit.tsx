import type { ReactNode } from "react";
import { AlertTriangle, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "primary" | "success" | "warning" | "danger" | "info";

const toneBorder: Record<Tone, string> = {
  primary: "border-l-primary",
  success: "border-l-success",
  warning: "border-l-warning",
  danger: "border-l-danger",
  info: "border-l-info",
};

const toneText: Record<Tone, string> = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
};

export function StatCard({
  label,
  value,
  sublabel,
  trend,
  tone = "primary",
}: {
  label: string;
  value: string;
  sublabel?: string;
  trend?: { dir: "up" | "down"; text: string; good?: boolean };
  tone?: Tone;
}) {
  const good = trend?.good ?? trend?.dir === "up";
  return (
    <div className={cn("surface-card border-l-4 p-4", toneBorder[tone])}>
      <p className="label-caps text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      {(sublabel || trend) && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          {trend && (
            <span className={cn("flex items-center gap-0.5 font-medium", good ? "text-success" : "text-danger")}>
              {trend.dir === "up" ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              {trend.text}
            </span>
          )}
          {sublabel && <span>{sublabel}</span>}
        </div>
      )}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const s = status.toLowerCase();
  const tone: Tone = s.includes("healthy") || s.includes("closed") || s.includes("completed") || s.includes("match")
    ? "success"
    : s.includes("degraded") || s.includes("appeal") || s.includes("running") || s.includes("partial")
      ? "warning"
      : s.includes("grievance") || s.includes("vulnerab") || s.includes("failed") || s.includes("mismatch") || s.includes("unreachable") || s.includes("down")
        ? "danger"
        : "info";
  const bg: Record<Tone, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    danger: "bg-danger-soft text-danger",
    info: "bg-info-soft text-info",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", bg[tone])}>
      {status}
    </span>
  );
}

export function AnomalyBanner({ headline, detail }: { headline: string; detail: string }) {
  return (
    <div className="flex w-full items-start gap-3 rounded-xl border border-danger/25 bg-danger-soft p-4">
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-danger" />
      <div>
        <p className="text-sm font-semibold text-danger">{headline}</p>
        <p className="mt-0.5 text-sm text-foreground/80">{detail}</p>
      </div>
    </div>
  );
}

export function DropOffFunnel({ steps, labels }: { steps: number[]; labels?: string[] }) {
  const total = steps.reduce((a, b) => a + b, 0);
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
        {steps.map((s, i) => (
          <div
            key={i}
            style={{
              width: `${(s / total) * 100}%`,
              background: `color-mix(in oklab, var(--primary) ${100 - i * 18}%, var(--danger))`,
            }}
            className="h-full border-r border-card last:border-0"
          />
        ))}
      </div>
      {labels && (
        <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("surface-card p-5", className)}>
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function FilterPill({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
      <span className="label-caps text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-[220px] truncate bg-transparent text-xs font-medium text-foreground outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export const CHART_COLORS = [
  "var(--primary)",
  "var(--info)",
  "var(--success)",
  "var(--warning)",
  "var(--danger)",
  "var(--primary-dark)",
  "color-mix(in oklab, var(--info) 60%, white)",
  "color-mix(in oklab, var(--success) 60%, black)",
  "color-mix(in oklab, var(--warning) 70%, black)",
  "color-mix(in oklab, var(--danger) 60%, white)",
];

export const distressTone = (d: string) =>
  d === "Calm" ? "success" : d === "Concerned" ? "info" : d === "Distressed" ? "warning" : "danger";
