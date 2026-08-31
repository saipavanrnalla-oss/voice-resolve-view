import { useCallback, useEffect, useMemo } from "react";
import dagre from "@dagrejs/dagre";
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { Handle, Position } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { cn } from "@/lib/utils";

export type CallPhase = {
  id: string;
  label: string;
  subAgents: { name: string; role: string }[];
  status: "idle" | "active" | "done";
};

export const BASE_PHASES: CallPhase[] = [
  {
    id: "p1",
    label: "Claim Rejected — Notification Queued",
    subAgents: [{ name: "Claims Data Sync Agent", role: "Pulls rejection reason and policy clause reference" }],
    status: "idle",
  },
  {
    id: "p2",
    label: "Outreach Attempt",
    subAgents: [
      { name: "Voice Agent", role: "Places the outbound call" },
      { name: "Channel Orchestrator", role: "Voice → SMS → WhatsApp → Email on no-answer" },
      { name: "Vulnerability Screener", role: "Screens for vulnerability indicators" },
    ],
    status: "idle",
  },
  {
    id: "p3",
    label: "Reason Explained & Comprehension Check",
    subAgents: [
      { name: "Voice Agent", role: "States rejection reason mapped to policy clause" },
      { name: "Sentiment Agent", role: "Scores distress across the call" },
    ],
    status: "idle",
  },
  {
    id: "p4",
    label: "Next-Step Communicated",
    subAgents: [{ name: "Next-Step Agent", role: "Branches on the claimant's spoken response" }],
    status: "idle",
  },
  {
    id: "p5",
    label: "Terminal State Assigned",
    subAgents: [{ name: "Disposition Agent", role: "Records the call's own terminal state" }],
    status: "idle",
  },
];

function PhaseNode({ data }: NodeProps) {
  const phase = data as unknown as CallPhase;
  return (
    <div
      className={cn(
        "w-64 rounded-xl border bg-card p-3 shadow-[var(--shadow-card)] transition-colors",
        phase.status === "active" && "border-primary ring-2 ring-primary/25",
        phase.status === "done" && "border-success",
        phase.status === "idle" && "border-border opacity-75",
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-border" />
      <div className="flex items-center justify-between gap-2">
        <p className="label-caps text-muted-foreground">Phase</p>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-medium",
            phase.status === "active" && "bg-primary/10 text-primary",
            phase.status === "done" && "bg-success-soft text-success",
            phase.status === "idle" && "bg-muted text-muted-foreground",
          )}
        >
          {phase.status}
        </span>
      </div>
      <p className="mt-1 text-sm font-semibold leading-snug text-foreground">{phase.label}</p>
      <ul className="mt-2 space-y-1">
        {phase.subAgents.map((a) => (
          <li key={a.name} className="text-[11px] leading-snug text-muted-foreground">
            <span className="font-medium text-foreground">{a.name}</span> — {a.role}
          </li>
        ))}
      </ul>
      <Handle type="source" position={Position.Right} className="!bg-border" />
    </div>
  );
}

const nodeTypes = { phase: PhaseNode };

function layout(phases: CallPhase[]): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "LR", nodesep: 40, ranksep: 70 });
  g.setDefaultEdgeLabel(() => ({}));
  phases.forEach((p) => g.setNode(p.id, { width: 256, height: 150 }));
  phases.slice(1).forEach((p, i) => g.setEdge(phases[i]!.id, p.id));
  dagre.layout(g);

  const nodes: Node[] = phases.map((p) => {
    const n = g.node(p.id);
    return {
      id: p.id,
      type: "phase",
      position: { x: n.x - 128, y: n.y - 75 },
      data: p as unknown as Record<string, unknown>,
    };
  });
  const edges: Edge[] = phases.slice(1).map((p, i) => ({
    id: `${phases[i]!.id}-${p.id}`,
    source: phases[i]!.id,
    target: p.id,
    animated: p.status === "active",
    style: { stroke: p.status === "idle" ? "var(--border)" : "var(--primary)" },
  }));
  return { nodes, edges };
}

function Inner({ phases }: { phases: CallPhase[] }) {
  const { nodes, edges } = useMemo(() => layout(phases), [phases]);
  const { fitView } = useReactFlow();
  const refit = useCallback(() => fitView({ padding: 0.15, duration: 200 }), [fitView]);

  useEffect(() => {
    refit();
    window.addEventListener("resize", refit);
    return () => window.removeEventListener("resize", refit);
  }, [refit]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      proOptions={{ hideAttribution: true }}
    >
      <Background color="var(--border)" gap={18} />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}

export function CallFlow({ phases }: { phases: CallPhase[] }) {
  return (
    <div className="h-[380px] w-full overflow-hidden rounded-xl border border-border bg-background">
      <ReactFlowProvider>
        <Inner phases={phases} />
      </ReactFlowProvider>
    </div>
  );
}
