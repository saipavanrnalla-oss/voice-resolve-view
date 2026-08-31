import { CATEGORY_SHORT, REJECTION_CATEGORIES } from "./mock-data";

export const CATEGORY_MIX: { category: string; short: string; pct: number; volume: number }[] = [
  ["Non-Disclosure at Proposal Stage", 20],
  ["Pre-Existing Disease — Waiting Period Not Completed", 20],
  ["Room Rent Sub-Limit Exceeded (Partial Rejection)", 20],
  ["Treatment Excluded Under Policy", 15],
  ["Incomplete / Insufficient Documentation", 12],
  ["Non-Network Hospital Without Pre-Authorization", 8],
  ["Policy Lapsed / Inactive at Hospitalization", 3],
  ["Claim Filed Beyond Permissible Time Limit", 1],
  ["Fraud Investigation Pending", 1],
].map(([category, pct]) => ({
  category: category as string,
  short: CATEGORY_SHORT[category as string] as string,
  pct: pct as number,
  volume: Math.round(((pct as number) / 100) * 18420),
}));

export const CATEGORY_STATS = REJECTION_CATEGORIES.map((category, i) => {
  const mix = CATEGORY_MIX.find((m) => m.category === category);
  const volume = mix?.volume ?? 210;
  const comprehension = [88, 71, 84, 90, 92, 86, 89, 87, 64, 79][i] as number;
  const distressRate = [46, 74, 58, 41, 27, 52, 38, 44, 81, 61][i] as number;
  const appealRate = [34, 41, 29, 12, 48, 57, 9, 62, 18, 44][i] as number;
  const grievanceRate = [9, 27, 14, 4, 3, 8, 2, 6, 31, 16][i] as number;
  const avgValue = [96000, 214000, 128000, 174000, 41000, 73000, 58000, 187000, 305000, 142000][i] as number;
  return {
    category: category as string,
    short: CATEGORY_SHORT[category] as string,
    volume,
    comprehension,
    distressRate,
    appealRate,
    grievanceRate,
    avgValue,
  };
});

export const TERMINAL_TREND = Array.from({ length: 12 }, (_, i) => {
  const w = i + 1;
  return {
    week: `W${w}`,
    "Reason Confirmed — Closed": 480 + i * 14 + (i % 3) * 22,
    "Reason Confirmed — Appeal Guidance Given": 300 + i * 11 + (i % 4) * 18,
    "Grievance Flagged": 96 + ((i * 7) % 26),
    "Escalated — Vulnerability": 38 + ((i * 5) % 14),
    "Unreachable — Retries Exhausted": 210 - i * 6 + (i % 2) * 12,
  };
});

export const DELIVERY_FUNNEL = [
  { stage: "Attempted", value: 18420 },
  { stage: "Connected", value: 11793 },
  { stage: "Right-Party Confirmed", value: 10908 },
  { stage: "Reason Explained", value: 10402 },
  { stage: "Comprehension Confirmed", value: 8721 },
  { stage: "Terminal State Assigned", value: 8508 },
];

export const STATE_VOLUME = [
  { state: "Maharashtra", code: "MH", volume: 2840 },
  { state: "Tamil Nadu", code: "TN", volume: 1960 },
  { state: "Karnataka", code: "KA", volume: 1810 },
  { state: "Delhi", code: "DL", volume: 1540 },
  { state: "Telangana", code: "TS", volume: 1320 },
  { state: "Uttar Pradesh", code: "UP", volume: 1275 },
  { state: "Gujarat", code: "GJ", volume: 1120 },
  { state: "Kerala", code: "KL", volume: 980 },
  { state: "West Bengal", code: "WB", volume: 940 },
  { state: "Rajasthan", code: "RJ", volume: 760 },
  { state: "Haryana", code: "HR", volume: 690 },
  { state: "Madhya Pradesh", code: "MP", volume: 640 },
  { state: "Punjab", code: "PB", volume: 520 },
  { state: "Andhra Pradesh", code: "AP", volume: 505 },
  { state: "Bihar", code: "BR", volume: 410 },
  { state: "Odisha", code: "OD", volume: 330 },
  { state: "Assam", code: "AS", volume: 210 },
  { state: "Chhattisgarh", code: "CG", volume: 195 },
  { state: "Jharkhand", code: "JH", volume: 185 },
  { state: "Uttarakhand", code: "UK", volume: 120 },
];

export const REASON_BY_MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, mi) => {
  const row: Record<string, string | number> = { month };
  CATEGORY_STATS.forEach((c, ci) => {
    row[c.short] = Math.round((c.volume / 6) * (0.85 + ((mi + ci) % 5) * 0.07));
  });
  return row;
});

export const DISTRESS_TREND = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8", "Wk 9", "Wk 10", "Wk 11", "Wk 12"].map((week, i) => ({
  week,
  distressRate: 34 + ((i * 3) % 9) - (i > 7 ? 4 : 0),
}));

export const SENTIMENT_DISTRIBUTION = [
  { name: "Calm", value: 31 },
  { name: "Concerned", value: 34 },
  { name: "Distressed", value: 24 },
  { name: "Angry", value: 11 },
];

export const TRAJECTORY = [
  { name: "Starts calm, shifts negative mid-call", value: 28 },
  { name: "Starts negative, de-escalated by call end", value: 19 },
  { name: "Stable calm throughout", value: 39 },
  { name: "Negative throughout", value: 14 },
];

export const APPEAL_TREND = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7", "Wk 8", "Wk 9", "Wk 10", "Wk 11", "Wk 12"].map((week, i) => ({
  week,
  appealGuidance: 31 + ((i * 2) % 7),
  grievanceFlagged: 11 + ((i * 3) % 5),
}));

export const WORKFLOWS = [
  {
    name: "Initial Rejection Notification",
    active: 412,
    completion: 94.2,
    avgTime: "4m 18s",
    cost: "₹1,24,600",
    status: "Healthy" as const,
    funnel: [100, 64, 59, 56, 47],
  },
  {
    name: "Retry & Channel Escalation Cascade",
    active: 168,
    completion: 71.5,
    avgTime: "9m 02s",
    cost: "₹68,200",
    status: "Degraded" as const,
    funnel: [100, 78, 51, 38, 29],
  },
  {
    name: "Appeal Guidance Delivery",
    active: 205,
    completion: 91.8,
    avgTime: "3m 41s",
    cost: "₹54,900",
    status: "Healthy" as const,
    funnel: [100, 92, 88, 84, 81],
  },
  {
    name: "Grievance Flagging",
    active: 74,
    completion: 88.4,
    avgTime: "2m 56s",
    cost: "₹21,300",
    status: "Healthy" as const,
    funnel: [100, 95, 90, 87, 84],
  },
  {
    name: "Vulnerable Customer Priority Track",
    active: 31,
    completion: 96.1,
    avgTime: "2m 12s",
    cost: "₹9,800",
    status: "Healthy" as const,
    funnel: [100, 98, 96, 94, 92],
  },
];

export const INSTANCES = [
  { claim: "CLM-H10432", workflow: "Initial Rejection Notification", phase: "Terminal State Assigned", status: "Completed", duration: "4m 28s" },
  { claim: "CLM-H10488", workflow: "Grievance Flagging", phase: "Terminal State Assigned", status: "Completed", duration: "6m 42s" },
  { claim: "CLM-H10556", workflow: "Appeal Guidance Delivery", phase: "Next-Step Communicated", status: "Completed", duration: "5m 01s" },
  { claim: "CLM-H10602", workflow: "Retry & Channel Escalation Cascade", phase: "Outreach Attempt", status: "Completed", duration: "3h 30m" },
  { claim: "CLM-H10649", workflow: "Vulnerable Customer Priority Track", phase: "Terminal State Assigned", status: "Completed", duration: "3m 34s" },
  { claim: "CLM-H10742", workflow: "Retry & Channel Escalation Cascade", phase: "Outreach Attempt", status: "Failed — no connect", duration: "7h 12m" },
  { claim: "CLM-H10758", workflow: "Grievance Flagging", phase: "Terminal State Assigned", status: "Completed", duration: "6m 58s" },
  { claim: "CLM-H10804", workflow: "Appeal Guidance Delivery", phase: "Next-Step Communicated", status: "Running", duration: "5m 12s" },
  { claim: "CLM-H10826", workflow: "Vulnerable Customer Priority Track", phase: "Reason Explained", status: "Completed", duration: "3m 08s" },
  { claim: "CLM-H10847", workflow: "Retry & Channel Escalation Cascade", phase: "Outreach Attempt", status: "Failed — no connect", duration: "8h 04m" },
];

export const CHANNELS = [
  { name: "Voice", status: "Healthy" as const, latency: "412 ms", success: 96.4, volume: 3218 },
  { name: "SMS", status: "Healthy" as const, latency: "1.2 s", success: 98.1, volume: 1470 },
  { name: "WhatsApp", status: "Degraded" as const, latency: "6.8 s", success: 82.3, volume: 906 },
  { name: "Email", status: "Healthy" as const, latency: "3.4 s", success: 97.2, volume: 640 },
];
