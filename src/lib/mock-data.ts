export type TerminalState =
  | "Reason Confirmed — Closed"
  | "Reason Confirmed — Appeal Guidance Given"
  | "Grievance Flagged"
  | "Escalated — Vulnerability"
  | "Unreachable — Retries Exhausted";

export type SubRemark =
  | "Comprehension Confirmed First Attempt"
  | "Comprehension Confirmed After Repeat"
  | "Dispute Raised"
  | "No Response Given";

export type Distress = "Calm" | "Concerned" | "Distressed" | "Angry";

export const TERMINAL_STATES: TerminalState[] = [
  "Reason Confirmed — Closed",
  "Reason Confirmed — Appeal Guidance Given",
  "Grievance Flagged",
  "Escalated — Vulnerability",
  "Unreachable — Retries Exhausted",
];

export const REJECTION_CATEGORIES = [
  "Pre-Existing Disease — Waiting Period Not Completed",
  "Non-Disclosure at Proposal Stage",
  "Treatment Excluded Under Policy",
  "Policy Lapsed / Inactive at Hospitalization",
  "Incomplete / Insufficient Documentation",
  "Non-Network Hospital Without Pre-Authorization",
  "Claim Filed Beyond Permissible Time Limit",
  "Room Rent Sub-Limit Exceeded (Partial Rejection)",
  "Fraud Investigation Pending",
  "Treatment Not Medically Justified (TPA Doctor Review)",
] as const;

export type RejectionCategory = (typeof REJECTION_CATEGORIES)[number];

export const CATEGORY_SHORT: Record<string, string> = {
  "Pre-Existing Disease — Waiting Period Not Completed": "Waiting Period",
  "Non-Disclosure at Proposal Stage": "Non-Disclosure",
  "Treatment Excluded Under Policy": "Treatment Excluded",
  "Policy Lapsed / Inactive at Hospitalization": "Policy Lapsed",
  "Incomplete / Insufficient Documentation": "Documentation",
  "Non-Network Hospital Without Pre-Authorization": "No Pre-Auth",
  "Claim Filed Beyond Permissible Time Limit": "Filed Late",
  "Room Rent Sub-Limit Exceeded (Partial Rejection)": "Room Rent Sub-Limit",
  "Fraud Investigation Pending": "Fraud Investigation",
  "Treatment Not Medically Justified (TPA Doctor Review)": "Not Medically Justified",
};

export const INSURERS = ["Star Health", "Niva Bupa", "HDFC ERGO Health"] as const;

export type TranscriptTurn = {
  t: string;
  speaker: "Voice Agent" | "Claimant";
  text: string;
  marker?: "Reason stated" | "Comprehension check" | "Distress spike" | "Terminal state";
  sentiment: number;
};

export type Claim = {
  id: string;
  claimant: string;
  age: number;
  gender: "F" | "M";
  city: string;
  state: string;
  policyNumber: string;
  insurer: string;
  treatment: string;
  hospital: string;
  value: number;
  category: RejectionCategory;
  clause: string;
  terminalState: TerminalState;
  subRemark: SubRemark;
  distress: Distress;
  distressScore: number;
  callDate: string;
  callTime: string;
  durationSec: number;
  attempts: number;
  channel: "Voice" | "WhatsApp" | "SMS";
  commsPreference: string;
  nextStepGuidance: string[];
  timeline: { label: string; time: string }[];
  transcript: TranscriptTurn[];
  qaTags: ("FLOW ISSUE" | "CLASSIFIER ISSUE")[];
  reasonAccuracy: "Match" | "Mismatch";
  disclosures: { recording: boolean; clauseCited: boolean; rightToDispute: boolean };
  prohibitedLanguage: string | null;
  playback: boolean;
  vulnerabilityFlag?: boolean;
};

const inr = (n: number) => n;

export const CLAIMS: Claim[] = [
  {
    id: "CLM-H10432",
    claimant: "Anjali Verma",
    age: 34,
    gender: "F",
    city: "Pune",
    state: "Maharashtra",
    policyNumber: "SH-PN-4471902",
    insurer: "Star Health",
    treatment: "Cataract surgery",
    hospital: "Sunview Multispeciality Hospital",
    value: inr(68400),
    category: "Non-Network Hospital Without Pre-Authorization",
    clause: "Clause 4.2 (c) — Cashless / Reimbursement Pre-Authorization",
    terminalState: "Reason Confirmed — Appeal Guidance Given",
    subRemark: "Comprehension Confirmed After Repeat",
    distress: "Distressed",
    distressScore: 78,
    callDate: "11 Jun 2026",
    callTime: "10:42",
    durationSec: 268,
    attempts: 1,
    channel: "Voice",
    commsPreference: "Voice (Hindi)",
    nextStepGuidance: [
      "Appeal window of 15 days from rejection date stated on call",
      "Documents named on call: discharge summary, itemised hospital bill, treating doctor's note on urgency",
      "Appeal submission route stated: TPA claimant portal, appeal reference CLM-H10432/AP1",
    ],
    timeline: [
      { label: "Rejection queued", time: "11 Jun 2026 · 09:15" },
      { label: "Call attempted", time: "11 Jun 2026 · 10:42" },
      { label: "Connected", time: "11 Jun 2026 · 10:42" },
      { label: "Terminal state assigned", time: "11 Jun 2026 · 10:47" },
    ],
    transcript: [
      { t: "00:00", speaker: "Voice Agent", text: "Good morning, this is the ArogyaLink TPA assistance line calling on a recorded line about claim CLM-H10432. Am I speaking with Anjali Verma?", sentiment: 60 },
      { t: "00:09", speaker: "Claimant", text: "Yes, speaking. Is this about my cataract claim?", sentiment: 58 },
      { t: "00:14", speaker: "Voice Agent", text: "It is. The claim for ₹68,400 at Sunview Multispeciality Hospital has been rejected. The reason recorded is treatment at a non-network hospital without pre-authorization, under Clause 4.2 (c) of your policy.", marker: "Reason stated", sentiment: 45 },
      { t: "00:29", speaker: "Claimant", text: "But the surgery was scheduled, the hospital said they would handle everything.", sentiment: 32 },
      { t: "00:36", speaker: "Voice Agent", text: "I understand. Pre-authorization for a non-network hospital has to be raised with the TPA before admission, and no request was received against this claim.", sentiment: 30 },
      { t: "00:48", speaker: "Claimant", text: "This is sixty-eight thousand rupees. I have already paid it from my savings.", marker: "Distress spike", sentiment: 18 },
      { t: "00:56", speaker: "Voice Agent", text: "The rejection is not final. You can file an appeal within 15 days of the rejection date with the discharge summary, the itemised hospital bill and a note from your treating doctor on why the hospital was chosen.", sentiment: 26 },
      { t: "01:12", speaker: "Voice Agent", text: "To confirm you have the reason: the claim was rejected because pre-authorization was not obtained for a non-network hospital. Can you confirm you have understood that?", marker: "Comprehension check", sentiment: 28 },
      { t: "01:24", speaker: "Claimant", text: "Say it once more please.", sentiment: 26 },
      { t: "01:28", speaker: "Voice Agent", text: "The hospital was outside the network and no pre-authorization request was raised before admission. That is the recorded reason for rejection.", sentiment: 30 },
      { t: "01:39", speaker: "Claimant", text: "Yes, I have understood. Where do I send the appeal?", sentiment: 38 },
      { t: "01:45", speaker: "Voice Agent", text: "Through the TPA claimant portal under appeal reference CLM-H10432/AP1. You also have the right to dispute this decision with the Grievance Cell if you disagree with the outcome.", sentiment: 44 },
      { t: "01:58", speaker: "Claimant", text: "Alright. Thank you.", sentiment: 46 },
      { t: "02:02", speaker: "Voice Agent", text: "Terminal state recorded: reason confirmed, appeal guidance given.", marker: "Terminal state", sentiment: 48 },
    ],
    qaTags: [],
    reasonAccuracy: "Match",
    disclosures: { recording: true, clauseCited: true, rightToDispute: true },
    prohibitedLanguage: null,
    playback: true,
  },
  {
    id: "CLM-H10488",
    claimant: "Rajeev Menon",
    age: 58,
    gender: "M",
    city: "Kochi",
    state: "Kerala",
    policyNumber: "NB-KL-7730155",
    insurer: "Niva Bupa",
    treatment: "Cardiac angioplasty",
    hospital: "Marine Cross Heart Institute",
    value: inr(342000),
    category: "Non-Disclosure at Proposal Stage",
    clause: "Clause 7.1 — Material Non-Disclosure at Proposal",
    terminalState: "Grievance Flagged",
    subRemark: "Dispute Raised",
    distress: "Angry",
    distressScore: 91,
    callDate: "12 Jun 2026",
    callTime: "16:05",
    durationSec: 402,
    attempts: 1,
    channel: "Voice",
    commsPreference: "Voice (English)",
    nextStepGuidance: [
      "Dispute recorded verbatim on call and routed to the Grievance Cell",
      "Grievance reference stated on call: GRV-2026-04417",
      "Claimant advised of right to escalate to the Insurance Ombudsman if unsatisfied",
    ],
    timeline: [
      { label: "Rejection queued", time: "12 Jun 2026 · 14:20" },
      { label: "Call attempted", time: "12 Jun 2026 · 16:05" },
      { label: "Connected", time: "12 Jun 2026 · 16:05" },
      { label: "Terminal state assigned", time: "12 Jun 2026 · 16:12" },
    ],
    transcript: [
      { t: "00:00", speaker: "Voice Agent", text: "Good afternoon, this is the ArogyaLink TPA assistance line on a recorded call regarding claim CLM-H10488. Am I speaking with Rajeev Menon?", sentiment: 58 },
      { t: "00:10", speaker: "Claimant", text: "Yes. I have been waiting for an update for four days.", sentiment: 44 },
      { t: "00:16", speaker: "Voice Agent", text: "The claim of ₹3,42,000 for cardiac angioplasty at Marine Cross Heart Institute has been rejected under Clause 7.1, material non-disclosure at proposal stage. Hypertension diagnosed prior to the policy date was not declared on the proposal form.", marker: "Reason stated", sentiment: 30 },
      { t: "00:34", speaker: "Claimant", text: "That is not correct. Nobody asked me about blood pressure. The agent filled the form himself and told me to sign.", marker: "Distress spike", sentiment: 12 },
      { t: "00:45", speaker: "Voice Agent", text: "I am recording that as a dispute against the rejection reason. I will not comment on how the proposal was completed.", sentiment: 16 },
      { t: "00:54", speaker: "Claimant", text: "Three and a half lakh rupees. I have paid premium for six years without one claim.", sentiment: 10 },
      { t: "01:04", speaker: "Voice Agent", text: "To confirm the recorded reason: the claim was rejected on non-disclosure of a pre-existing condition at proposal stage. Can you confirm you have understood the reason, even though you disagree with it?", marker: "Comprehension check", sentiment: 14 },
      { t: "01:20", speaker: "Claimant", text: "I understand what you are saying. I do not accept it.", sentiment: 15 },
      { t: "01:27", speaker: "Voice Agent", text: "That is your right. I am flagging this to the Grievance Cell under reference GRV-2026-04417. They will contact you on this number.", sentiment: 22 },
      { t: "01:40", speaker: "Claimant", text: "And if they say the same thing?", sentiment: 20 },
      { t: "01:44", speaker: "Voice Agent", text: "You may then approach the Insurance Ombudsman. I cannot predict the outcome of either step.", sentiment: 28 },
      { t: "01:54", speaker: "Claimant", text: "Fine. Register it.", sentiment: 26 },
      { t: "02:00", speaker: "Voice Agent", text: "Terminal state recorded: grievance flagged, dispute raised.", marker: "Terminal state", sentiment: 30 },
    ],
    qaTags: [],
    reasonAccuracy: "Match",
    disclosures: { recording: true, clauseCited: true, rightToDispute: true },
    prohibitedLanguage: null,
    playback: true,
  },
  {
    id: "CLM-H10517",
    claimant: "Fatima Sheikh",
    age: 29,
    gender: "F",
    city: "Hyderabad",
    state: "Telangana",
    policyNumber: "HE-TS-2290731",
    insurer: "HDFC ERGO Health",
    treatment: "Maternity — normal delivery",
    hospital: "Lotus Gate Women's Hospital",
    value: inr(52000),
    category: "Pre-Existing Disease — Waiting Period Not Completed",
    clause: "Clause 3.4 — Maternity Waiting Period (24 months)",
    terminalState: "Reason Confirmed — Closed",
    subRemark: "Comprehension Confirmed First Attempt",
    distress: "Concerned",
    distressScore: 46,
    callDate: "09 Jun 2026",
    callTime: "11:20",
    durationSec: 186,
    attempts: 1,
    channel: "Voice",
    commsPreference: "Voice (Telugu)",
    nextStepGuidance: [
      "Waiting period completion date stated on call: 02 Feb 2027",
      "No appeal route applicable; reason accepted on call",
    ],
    timeline: [
      { label: "Rejection queued", time: "09 Jun 2026 · 09:50" },
      { label: "Call attempted", time: "09 Jun 2026 · 11:20" },
      { label: "Connected", time: "09 Jun 2026 · 11:20" },
      { label: "Terminal state assigned", time: "09 Jun 2026 · 11:23" },
    ],
    transcript: [
      { t: "00:00", speaker: "Voice Agent", text: "This is the ArogyaLink TPA assistance line on a recorded call about claim CLM-H10517. Am I speaking with Fatima Sheikh?", sentiment: 60 },
      { t: "00:09", speaker: "Claimant", text: "Yes.", sentiment: 58 },
      { t: "00:12", speaker: "Voice Agent", text: "The maternity claim of ₹52,000 has been rejected because the 24-month maternity waiting period under Clause 3.4 was not completed at the date of admission.", marker: "Reason stated", sentiment: 42 },
      { t: "00:26", speaker: "Claimant", text: "So the policy does not cover it yet.", sentiment: 40 },
      { t: "00:31", speaker: "Voice Agent", text: "Correct. The waiting period completes on 02 Feb 2027. Can you confirm you have understood the reason for rejection?", marker: "Comprehension check", sentiment: 44 },
      { t: "00:41", speaker: "Claimant", text: "Yes, I understand.", sentiment: 48 },
      { t: "00:45", speaker: "Voice Agent", text: "You have the right to dispute this with the Grievance Cell if you disagree. Terminal state recorded: reason confirmed, closed.", marker: "Terminal state", sentiment: 52 },
    ],
    qaTags: [],
    reasonAccuracy: "Match",
    disclosures: { recording: true, clauseCited: true, rightToDispute: true },
    prohibitedLanguage: null,
    playback: false,
  },
  {
    id: "CLM-H10556",
    claimant: "Suresh Iyer",
    age: 62,
    gender: "M",
    city: "Chennai",
    state: "Tamil Nadu",
    policyNumber: "SH-TN-6612480",
    insurer: "Star Health",
    treatment: "Total knee replacement",
    hospital: "Palmgrove Orthopaedic Centre",
    value: inr(210000),
    category: "Room Rent Sub-Limit Exceeded (Partial Rejection)",
    clause: "Clause 5.6 — Room Rent Sub-Limit (1% of sum insured per day)",
    terminalState: "Reason Confirmed — Appeal Guidance Given",
    subRemark: "Comprehension Confirmed After Repeat",
    distress: "Concerned",
    distressScore: 54,
    callDate: "10 Jun 2026",
    callTime: "15:12",
    durationSec: 301,
    attempts: 2,
    channel: "Voice",
    commsPreference: "Voice (Tamil)",
    nextStepGuidance: [
      "Proportionate deduction of ₹38,700 explained line by line on call",
      "Appeal route stated for the deducted amount, reference CLM-H10556/AP1",
    ],
    timeline: [
      { label: "Rejection queued", time: "10 Jun 2026 · 12:00" },
      { label: "Call attempted (no answer)", time: "10 Jun 2026 · 13:30" },
      { label: "Call attempted", time: "10 Jun 2026 · 15:12" },
      { label: "Connected", time: "10 Jun 2026 · 15:12" },
      { label: "Terminal state assigned", time: "10 Jun 2026 · 15:17" },
    ],
    transcript: [
      { t: "00:00", speaker: "Voice Agent", text: "This is the ArogyaLink TPA assistance line on a recorded call about claim CLM-H10556. Am I speaking with Suresh Iyer?", sentiment: 60 },
      { t: "00:10", speaker: "Claimant", text: "Yes. The settlement is short by almost forty thousand.", sentiment: 42 },
      { t: "00:17", speaker: "Voice Agent", text: "That is the reason for this call. The claim is partially rejected: the room selected exceeded the room rent sub-limit under Clause 5.6, so associated charges were proportionately reduced by ₹38,700.", marker: "Reason stated", sentiment: 34 },
      { t: "00:33", speaker: "Claimant", text: "The hospital gave that room, I did not ask for an upgrade.", marker: "Distress spike", sentiment: 26 },
      { t: "00:40", speaker: "Voice Agent", text: "The deduction is applied on the room category billed, regardless of who selected it. The eligible room rent was ₹4,000 per day against ₹6,500 billed.", sentiment: 30 },
      { t: "00:54", speaker: "Voice Agent", text: "To confirm: the deduction is due to the room rent sub-limit, and the rest of the claim is settled. Can you confirm you have understood?", marker: "Comprehension check", sentiment: 34 },
      { t: "01:06", speaker: "Claimant", text: "Repeat the deduction figure.", sentiment: 34 },
      { t: "01:10", speaker: "Voice Agent", text: "₹38,700 deducted from a claimed ₹2,10,000. Balance settled to your registered account.", sentiment: 38 },
      { t: "01:20", speaker: "Claimant", text: "Understood. Can I contest the deduction?", sentiment: 40 },
      { t: "01:26", speaker: "Voice Agent", text: "Yes, you can appeal the deducted amount under reference CLM-H10556/AP1, and you have the right to dispute with the Grievance Cell.", sentiment: 46 },
      { t: "01:38", speaker: "Voice Agent", text: "Terminal state recorded: reason confirmed, appeal guidance given.", marker: "Terminal state", sentiment: 48 },
    ],
    qaTags: ["CLASSIFIER ISSUE"],
    reasonAccuracy: "Match",
    disclosures: { recording: true, clauseCited: true, rightToDispute: true },
    prohibitedLanguage: null,
    playback: false,
  },
  {
    id: "CLM-H10602",
    claimant: "Priya Nair",
    age: 41,
    gender: "F",
    city: "Bengaluru",
    state: "Karnataka",
    policyNumber: "NB-KA-5518803",
    insurer: "Niva Bupa",
    treatment: "Dengue hospitalization",
    hospital: "Greenfield City Hospital",
    value: inr(34000),
    category: "Incomplete / Insufficient Documentation",
    clause: "Clause 9.2 — Claim Documentation Requirements",
    terminalState: "Reason Confirmed — Closed",
    subRemark: "Comprehension Confirmed First Attempt",
    distress: "Calm",
    distressScore: 22,
    callDate: "13 Jun 2026",
    callTime: "12:35",
    durationSec: 154,
    attempts: 3,
    channel: "WhatsApp",
    commsPreference: "WhatsApp",
    nextStepGuidance: [
      "Two Voice attempts unanswered; contact made on WhatsApp fallback",
      "Missing documents named on call: platelet trend report, pharmacy bill breakup",
    ],
    timeline: [
      { label: "Rejection queued", time: "13 Jun 2026 · 09:05" },
      { label: "Voice attempt 1 (no answer)", time: "13 Jun 2026 · 10:10" },
      { label: "Voice attempt 2 (no answer)", time: "13 Jun 2026 · 11:24" },
      { label: "WhatsApp session connected", time: "13 Jun 2026 · 12:35" },
      { label: "Terminal state assigned", time: "13 Jun 2026 · 12:38" },
    ],
    transcript: [
      { t: "00:00", speaker: "Voice Agent", text: "ArogyaLink TPA, regarding claim CLM-H10602. This session is recorded. Am I speaking with Priya Nair?", sentiment: 62 },
      { t: "00:08", speaker: "Claimant", text: "Yes, I missed two calls earlier.", sentiment: 60 },
      { t: "00:13", speaker: "Voice Agent", text: "The claim of ₹34,000 was rejected under Clause 9.2 for insufficient documentation — the platelet trend report and the pharmacy bill breakup were not submitted.", marker: "Reason stated", sentiment: 50 },
      { t: "00:27", speaker: "Claimant", text: "I have both. I can send them.", sentiment: 55 },
      { t: "00:32", speaker: "Voice Agent", text: "Can you confirm you have understood which two documents were missing?", marker: "Comprehension check", sentiment: 56 },
      { t: "00:38", speaker: "Claimant", text: "Platelet report and the pharmacy breakup. Yes.", sentiment: 60 },
      { t: "00:44", speaker: "Voice Agent", text: "You have the right to dispute this decision with the Grievance Cell. Terminal state recorded: reason confirmed, closed.", marker: "Terminal state", sentiment: 62 },
    ],
    qaTags: [],
    reasonAccuracy: "Match",
    disclosures: { recording: true, clauseCited: true, rightToDispute: true },
    prohibitedLanguage: null,
    playback: false,
  },
  {
    id: "CLM-H10649",
    claimant: "Arjun Bose",
    age: 71,
    gender: "M",
    city: "Kolkata",
    state: "West Bengal",
    policyNumber: "HE-WB-8840219",
    insurer: "HDFC ERGO Health",
    treatment: "Vitrectomy",
    hospital: "Eastbank Eye Hospital",
    value: inr(18500),
    category: "Treatment Excluded Under Policy",
    clause: "Clause 6.3 (f) — Permanent Exclusions",
    terminalState: "Escalated — Vulnerability",
    subRemark: "No Response Given",
    distress: "Distressed",
    distressScore: 83,
    callDate: "12 Jun 2026",
    callTime: "10:05",
    durationSec: 214,
    attempts: 1,
    channel: "Voice",
    commsPreference: "Voice (Bengali)",
    vulnerabilityFlag: true,
    nextStepGuidance: [
      "Vulnerability indicators detected mid-call: confusion on repeat, hearing difficulty",
      "Call closed to a human vulnerable-customer track; no further automated attempts scheduled",
    ],
    timeline: [
      { label: "Rejection queued", time: "12 Jun 2026 · 08:40" },
      { label: "Call attempted", time: "12 Jun 2026 · 10:05" },
      { label: "Connected", time: "12 Jun 2026 · 10:05" },
      { label: "Vulnerability flagged", time: "12 Jun 2026 · 10:07" },
      { label: "Terminal state assigned", time: "12 Jun 2026 · 10:09" },
    ],
    transcript: [
      { t: "00:00", speaker: "Voice Agent", text: "This is the ArogyaLink TPA assistance line on a recorded call about claim CLM-H10649. Am I speaking with Arjun Bose?", sentiment: 58 },
      { t: "00:11", speaker: "Claimant", text: "Hello? Speak louder please.", sentiment: 48 },
      { t: "00:16", speaker: "Voice Agent", text: "The claim of ₹18,500 for vitrectomy has been rejected because the procedure is a permanent exclusion under Clause 6.3 (f) of your policy.", marker: "Reason stated", sentiment: 38 },
      { t: "00:29", speaker: "Claimant", text: "The doctor said the eye surgery is covered. Who are you again?", marker: "Distress spike", sentiment: 22 },
      { t: "00:37", speaker: "Voice Agent", text: "I am the ArogyaLink TPA assistance line. Can you confirm you have understood the reason the claim was rejected?", marker: "Comprehension check", sentiment: 24 },
      { t: "00:47", speaker: "Claimant", text: "I do not follow this. My son handles the papers.", sentiment: 18 },
      { t: "00:54", speaker: "Voice Agent", text: "I am marking this call for a vulnerable-customer track so a human representative can call back and explain it fully. No further automated calls will be placed.", sentiment: 30 },
      { t: "01:08", speaker: "Voice Agent", text: "Terminal state recorded: escalated, vulnerability. You retain the right to dispute this decision with the Grievance Cell.", marker: "Terminal state", sentiment: 34 },
    ],
    qaTags: ["FLOW ISSUE"],
    reasonAccuracy: "Match",
    disclosures: { recording: true, clauseCited: true, rightToDispute: true },
    prohibitedLanguage: null,
    playback: false,
  },
];

type Seed = [
  string,
  string,
  number,
  string,
  string,
  string,
  string,
  number,
  RejectionCategory,
  TerminalState,
  SubRemark,
  Distress,
  number,
  string,
  string,
  number,
  ("FLOW ISSUE" | "CLASSIFIER ISSUE")[],
  "Match" | "Mismatch",
];

const seeds: Seed[] = [
  ["CLM-H10661", "Meera Joshi", 46, "Nagpur", "Maharashtra", "Star Health", "Gallbladder removal", 96000, "Non-Disclosure at Proposal Stage", "Grievance Flagged", "Dispute Raised", "Angry", 88, "14 Jun 2026", "09:48", 356, [], "Match"],
  ["CLM-H10673", "Vikram Sethi", 39, "Delhi", "Delhi", "Niva Bupa", "Spinal fusion", 415000, "Room Rent Sub-Limit Exceeded (Partial Rejection)", "Reason Confirmed — Appeal Guidance Given", "Comprehension Confirmed First Attempt", "Concerned", 51, "14 Jun 2026", "11:02", 288, [], "Match"],
  ["CLM-H10688", "Sneha Kulkarni", 31, "Pune", "Maharashtra", "HDFC ERGO Health", "Appendectomy", 74500, "Pre-Existing Disease — Waiting Period Not Completed", "Reason Confirmed — Closed", "Comprehension Confirmed First Attempt", "Calm", 24, "14 Jun 2026", "12:40", 162, [], "Match"],
  ["CLM-H10694", "Imran Qureshi", 55, "Lucknow", "Uttar Pradesh", "Star Health", "Dialysis package", 128000, "Pre-Existing Disease — Waiting Period Not Completed", "Reason Confirmed — Appeal Guidance Given", "Comprehension Confirmed After Repeat", "Distressed", 72, "15 Jun 2026", "10:15", 322, ["CLASSIFIER ISSUE"], "Match"],
  ["CLM-H10706", "Lakshmi Rao", 63, "Visakhapatnam", "Andhra Pradesh", "Niva Bupa", "Hip replacement", 265000, "Room Rent Sub-Limit Exceeded (Partial Rejection)", "Reason Confirmed — Closed", "Comprehension Confirmed First Attempt", "Concerned", 44, "15 Jun 2026", "13:25", 205, [], "Match"],
  ["CLM-H10718", "Gaurav Malhotra", 44, "Gurugram", "Haryana", "HDFC ERGO Health", "Bariatric surgery", 388000, "Treatment Excluded Under Policy", "Grievance Flagged", "Dispute Raised", "Angry", 86, "15 Jun 2026", "16:30", 371, [], "Mismatch"],
  ["CLM-H10725", "Deepa Menon", 37, "Thrissur", "Kerala", "Star Health", "Hysterectomy", 118000, "Non-Disclosure at Proposal Stage", "Reason Confirmed — Appeal Guidance Given", "Comprehension Confirmed After Repeat", "Distressed", 76, "16 Jun 2026", "09:30", 298, [], "Match"],
  ["CLM-H10737", "Harpreet Singh", 52, "Ludhiana", "Punjab", "Niva Bupa", "Cataract surgery — both eyes", 82000, "Non-Network Hospital Without Pre-Authorization", "Reason Confirmed — Appeal Guidance Given", "Comprehension Confirmed First Attempt", "Concerned", 49, "16 Jun 2026", "11:18", 241, [], "Match"],
  ["CLM-H10742", "Ritu Agarwal", 28, "Jaipur", "Rajasthan", "HDFC ERGO Health", "Typhoid hospitalization", 29500, "Incomplete / Insufficient Documentation", "Unreachable — Retries Exhausted", "No Response Given", "Calm", 12, "16 Jun 2026", "17:45", 0, [], "Match"],
  ["CLM-H10758", "Sanjay Deshmukh", 66, "Nashik", "Maharashtra", "Star Health", "Pacemaker implantation", 452000, "Fraud Investigation Pending", "Grievance Flagged", "Dispute Raised", "Angry", 94, "17 Jun 2026", "10:52", 418, ["FLOW ISSUE"], "Match"],
  ["CLM-H10764", "Anita Pillai", 48, "Coimbatore", "Tamil Nadu", "Niva Bupa", "Thyroidectomy", 97000, "Non-Disclosure at Proposal Stage", "Reason Confirmed — Closed", "Comprehension Confirmed After Repeat", "Distressed", 69, "17 Jun 2026", "12:05", 276, [], "Match"],
  ["CLM-H10779", "Mohit Bansal", 35, "Indore", "Madhya Pradesh", "HDFC ERGO Health", "ACL reconstruction", 156000, "Room Rent Sub-Limit Exceeded (Partial Rejection)", "Reason Confirmed — Appeal Guidance Given", "Comprehension Confirmed First Attempt", "Concerned", 42, "17 Jun 2026", "15:10", 234, [], "Match"],
  ["CLM-H10783", "Kavita Shah", 59, "Ahmedabad", "Gujarat", "Star Health", "Chemotherapy cycle", 224000, "Policy Lapsed / Inactive at Hospitalization", "Reason Confirmed — Closed", "Comprehension Confirmed First Attempt", "Distressed", 74, "18 Jun 2026", "09:22", 259, [], "Match"],
  ["CLM-H10791", "Rohit Kapoor", 42, "Noida", "Uttar Pradesh", "Niva Bupa", "Hernia repair", 68000, "Claim Filed Beyond Permissible Time Limit", "Reason Confirmed — Closed", "Comprehension Confirmed First Attempt", "Concerned", 47, "18 Jun 2026", "11:40", 178, [], "Match"],
  ["CLM-H10804", "Nisha Reddy", 33, "Hyderabad", "Telangana", "HDFC ERGO Health", "Ectopic pregnancy surgery", 143000, "Treatment Not Medically Justified (TPA Doctor Review)", "Reason Confirmed — Appeal Guidance Given", "Comprehension Confirmed After Repeat", "Distressed", 79, "18 Jun 2026", "14:15", 312, [], "Match"],
  ["CLM-H10812", "Ajay Nambiar", 50, "Mangaluru", "Karnataka", "Star Health", "Cardiac stent", 298000, "Room Rent Sub-Limit Exceeded (Partial Rejection)", "Reason Confirmed — Closed", "Comprehension Confirmed First Attempt", "Calm", 28, "19 Jun 2026", "10:08", 196, [], "Match"],
  ["CLM-H10826", "Farida Contractor", 68, "Mumbai", "Maharashtra", "Niva Bupa", "Cataract surgery", 61000, "Treatment Excluded Under Policy", "Escalated — Vulnerability", "No Response Given", "Distressed", 81, "19 Jun 2026", "12:52", 188, [], "Match"],
  ["CLM-H10833", "Pradeep Yadav", 45, "Patna", "Bihar", "HDFC ERGO Health", "Kidney stone removal", 54000, "Incomplete / Insufficient Documentation", "Reason Confirmed — Closed", "Comprehension Confirmed First Attempt", "Calm", 26, "19 Jun 2026", "15:36", 167, [], "Match"],
  ["CLM-H10847", "Shalini Gupta", 38, "Bhopal", "Madhya Pradesh", "Star Health", "Sinus surgery", 47000, "Non-Network Hospital Without Pre-Authorization", "Unreachable — Retries Exhausted", "No Response Given", "Calm", 10, "20 Jun 2026", "18:20", 0, [], "Match"],
];

const genericTranscript = (c: {
  id: string;
  claimant: string;
  value: number;
  category: RejectionCategory;
  clause: string;
  terminalState: TerminalState;
}): TranscriptTurn[] => {
  if (c.terminalState === "Unreachable — Retries Exhausted") {
    return [
      { t: "00:00", speaker: "Voice Agent", text: `Outbound attempt placed for claim ${c.id}. No answer recorded.`, sentiment: 50 },
      { t: "00:00", speaker: "Voice Agent", text: "Terminal state recorded: unreachable, retries exhausted after 3 attempts.", marker: "Terminal state", sentiment: 50 },
    ];
  }
  return [
    { t: "00:00", speaker: "Voice Agent", text: `This is the ArogyaLink TPA assistance line on a recorded call about claim ${c.id}. Am I speaking with ${c.claimant}?`, sentiment: 60 },
    { t: "00:09", speaker: "Claimant", text: "Yes, speaking.", sentiment: 56 },
    { t: "00:14", speaker: "Voice Agent", text: `The claim of ₹${c.value.toLocaleString("en-IN")} has been rejected. The recorded reason is ${c.category.toLowerCase()}, under ${c.clause}.`, marker: "Reason stated", sentiment: 42 },
    { t: "00:30", speaker: "Claimant", text: "That was not explained to me at any point.", marker: "Distress spike", sentiment: 26 },
    { t: "00:38", speaker: "Voice Agent", text: "Can you confirm you have understood the recorded reason for the rejection?", marker: "Comprehension check", sentiment: 32 },
    { t: "00:47", speaker: "Claimant", text: "Yes, I have understood.", sentiment: 40 },
    { t: "00:53", speaker: "Voice Agent", text: `You have the right to dispute this decision with the Grievance Cell. Terminal state recorded: ${c.terminalState.toLowerCase()}.`, marker: "Terminal state", sentiment: 46 },
  ];
};

const CLAUSES: Record<RejectionCategory, string> = {
  "Pre-Existing Disease — Waiting Period Not Completed": "Clause 3.1 — Pre-Existing Disease Waiting Period",
  "Non-Disclosure at Proposal Stage": "Clause 7.1 — Material Non-Disclosure at Proposal",
  "Treatment Excluded Under Policy": "Clause 6.3 (f) — Permanent Exclusions",
  "Policy Lapsed / Inactive at Hospitalization": "Clause 2.5 — Grace Period and Policy Lapse",
  "Incomplete / Insufficient Documentation": "Clause 9.2 — Claim Documentation Requirements",
  "Non-Network Hospital Without Pre-Authorization": "Clause 4.2 (c) — Pre-Authorization",
  "Claim Filed Beyond Permissible Time Limit": "Clause 9.5 — Claim Intimation Timelines",
  "Room Rent Sub-Limit Exceeded (Partial Rejection)": "Clause 5.6 — Room Rent Sub-Limit",
  "Fraud Investigation Pending": "Clause 8.4 — Fraudulent Claims Investigation",
  "Treatment Not Medically Justified (TPA Doctor Review)": "Clause 6.9 — Medical Necessity Review",
};

const extra: Claim[] = seeds.map((s) => {
  const [id, claimant, age, city, state, insurer, treatment, value, category, terminalState, subRemark, distress, distressScore, callDate, callTime, durationSec, qaTags, reasonAccuracy] = s;
  const clause = CLAUSES[category];
  return {
    id,
    claimant,
    age,
    gender: ["Meera Joshi", "Sneha Kulkarni", "Lakshmi Rao", "Deepa Menon", "Ritu Agarwal", "Anita Pillai", "Kavita Shah", "Nisha Reddy", "Farida Contractor", "Shalini Gupta"].includes(claimant) ? "F" : "M",
    city,
    state,
    policyNumber: `PL-${id.slice(-5)}-${1000 + value % 8999}`,
    insurer,
    treatment,
    hospital: ["Sunview Multispeciality Hospital", "Greenfield City Hospital", "Palmgrove Orthopaedic Centre", "Northgate General Hospital", "Rivercrest Medical Centre"][value % 5],
    value,
    category,
    clause,
    terminalState,
    subRemark,
    distress,
    distressScore,
    callDate,
    callTime,
    durationSec,
    attempts: terminalState === "Unreachable — Retries Exhausted" ? 3 : 1,
    channel: "Voice",
    commsPreference: "Voice",
    nextStepGuidance:
      terminalState === "Reason Confirmed — Appeal Guidance Given"
        ? [`Appeal window of 15 days stated on call, reference ${id}/AP1`, "Supporting documents named on call: discharge summary, itemised bill"]
        : terminalState === "Grievance Flagged"
          ? ["Dispute recorded verbatim and routed to the Grievance Cell on call", "Right to approach the Insurance Ombudsman stated on call"]
          : terminalState === "Escalated — Vulnerability"
            ? ["Vulnerability indicators detected mid-call", "Automated attempts stopped; human vulnerable-customer track"]
            : terminalState === "Unreachable — Retries Exhausted"
              ? ["3 attempts placed inside the calling window, no connect", "No comprehension check possible"]
              : ["Reason accepted on call, no further action stated"],
    timeline: [
      { label: "Rejection queued", time: `${callDate} · 08:30` },
      { label: "Call attempted", time: `${callDate} · ${callTime}` },
      ...(terminalState === "Unreachable — Retries Exhausted" ? [] : [{ label: "Connected", time: `${callDate} · ${callTime}` }]),
      { label: "Terminal state assigned", time: `${callDate} · ${callTime}` },
    ],
    transcript: genericTranscript({ id, claimant, value, category, clause, terminalState }),
    qaTags,
    reasonAccuracy,
    disclosures: {
      recording: true,
      clauseCited: reasonAccuracy === "Match",
      rightToDispute: terminalState !== "Unreachable — Retries Exhausted",
    },
    prohibitedLanguage:
      id === "CLM-H10718"
        ? "Agent implied the appeal would succeed (\"they will definitely reverse this\")"
        : id === "CLM-H10758"
          ? "Agent speculated about fraud without basis (\"this usually means something was hidden\")"
          : null,
    playback: false,
  } as Claim;
});

export const ALL_CLAIMS: Claim[] = [...CLAIMS, ...extra];

export const claimById = (id: string) => ALL_CLAIMS.find((c) => c.id === id);

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const FLAGSHIP: Record<string, string> = {
  "Non-Network Hospital Without Pre-Authorization": "CLM-H10432",
  "Non-Disclosure at Proposal Stage": "CLM-H10488",
  "Pre-Existing Disease — Waiting Period Not Completed": "CLM-H10517",
  "Room Rent Sub-Limit Exceeded (Partial Rejection)": "CLM-H10556",
  "Incomplete / Insufficient Documentation": "CLM-H10602",
  "Treatment Excluded Under Policy": "CLM-H10649",
  "Policy Lapsed / Inactive at Hospitalization": "CLM-H10783",
  "Claim Filed Beyond Permissible Time Limit": "CLM-H10791",
  "Fraud Investigation Pending": "CLM-H10758",
  "Treatment Not Medically Justified (TPA Doctor Review)": "CLM-H10804",
};
