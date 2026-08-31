import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  ChevronDown,
  FileBarChart,
  HeartPulse,
  ListOrdered,
  MonitorCog,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  UserRound,
  Waypoints,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS: { label: string; items: { to: string; label: string; icon: typeof Activity }[] }[] = [
  { label: "Demo", items: [{ to: "/demo-console", label: "Demo Console", icon: Sparkles }] },
  {
    label: "Analytics",
    items: [
      { to: "/", label: "Executive Dashboard", icon: BarChart3 },
      { to: "/rejection-analytics", label: "Rejection Reason Analytics", icon: FileBarChart },
      { to: "/next-step-analytics", label: "Next-Step Analytics", icon: Waypoints },
      { to: "/sentiment-analytics", label: "Sentiment & Distress Analytics", icon: HeartPulse },
    ],
  },
  { label: "Calls", items: [{ to: "/calls", label: "Call Log", icon: PhoneCall }] },
  {
    label: "Observability",
    items: [
      { to: "/workflow-observability", label: "Workflow Observability", icon: MonitorCog },
      { to: "/channel-observability", label: "Channel Observability", icon: Activity },
    ],
  },
  { label: "Compliance", items: [{ to: "/compliance", label: "Compliance & QA Console", icon: ShieldCheck }] },
  { label: "Customer", items: [{ to: "/claimant-360", label: "Claimant 360", icon: UserRound }] },
];

function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col bg-sidebar lg:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="grid size-9 place-items-center rounded-lg bg-primary">
          <svg viewBox="0 0 24 24" className="size-5 fill-primary-foreground">
            <path d="M12 2l2.6 6.8L21.5 12l-6.9 3.2L12 22l-2.6-6.8L2.5 12l6.9-3.2L12 2z" />
          </svg>
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">desible.ai</p>
          <p className="text-xs font-light text-sidebar-foreground">× ArogyaLink</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-6">
        {SECTIONS.map((section) => (
          <div key={section.label} className="mb-5">
            <p className="label-caps px-2 pb-2 text-sidebar-label">{section.label}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
                        active
                          ? "bg-[rgba(232,112,58,0.08)] font-medium text-sidebar-active"
                          : "text-sidebar-foreground hover:bg-sidebar-raised hover:text-white",
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function TopBar({ crumb }: { crumb: string }) {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-6 py-3">
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span>desible.ai</span>
        <span>›</span>
        <span>Health</span>
        <span>›</span>
        <span className="font-medium text-foreground">{crumb}</span>
      </nav>
      <div className="flex items-center gap-3">
        <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground">
          Star Health
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-2 rounded-full bg-success" />
          Platform live
        </span>
        <span className="rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-medium text-warning">
          Demo Environment
        </span>
      </div>
    </header>
  );
}

export function AppShell({ children, crumb = "Claims Resolution" }: { children: ReactNode; crumb?: string }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <TopBar crumb={crumb} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export const NAV_ICON = ListOrdered;
