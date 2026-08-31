# Arogya Clarity

# ArogyaLink TPA — Claims Rejection Resolution Dashboard (v2 — Consumption Only)

## What you are building

A live, demo-ready **consumption-only analytics dashboard** showing Desible.ai's
voice agent performance on the claims-rejection communication use case for
ArogyaLink TPA — a placeholder health TPA name. When a claim is rejected,
Desible's Voice Agent calls the claimant, explains the rejection reason,
confirms comprehension, and gives next-step guidance. This dashboard reports
on that call activity. It does not include any human-in-the-loop queue,
approval/override actions, or workflow-editing tools — every screen is
read-only reporting.

**Hard constraint on metrics:** every number on every screen must be directly
or indirectly derivable from the call itself — the transcript, the call's own
timestamps, the agent's logged disposition, or the sentiment model's scoring
of that call. No metric may depend on a downstream system's later state
(claims-system appeal decision, grievance officer's response, whether a
follow-up SMS was actually delivered). If a stat like "appeal filed" would
require knowing what happened after the call ended, it doesn't belong here —
use "Appeal Guidance Given" (what the call itself established) instead.

Full functional single-page React app, no backend — mock data throughout.
Plain functional copy everywhere — no marketing language, no explanatory
captions that describe the UI to the viewer.

---

## Brand

Same design system as the rest of the Desible product suite — pulled from
the live PRISM product (not the marketing deck):

- Primary accent: **#E8703A** (orange) · Darker variant: **#D9622B**
- Sidebar base: **#10141C** (near-black navy), section labels **#6B7280**
  uppercase small-caps with letter-spacing, inactive item text **#9CA3AF**,
  active item orange text + `rgba(232,112,58,0.08)` background highlight
- Main canvas background: **#F5F6F8**; cards white, border **#E5E7EB**,
  radius ~12px, soft shadow
- Status colours: green **#16A34A** (healthy/positive), amber **#D97706**
  (medium/moderate), red **#DC2626** (critical/negative), blue **#2563EB**
  (neutral/informational)
- Text: primary **#111827**, secondary **#6B7280**
- Font: Inter throughout
- Logo lockup, top-left of sidebar: diamond/star mark in an orange rounded
  square + **"desible.ai"** wordmark, with **"× ArogyaLink"** in lighter
  sidebar text weight
- Top bar: breadcrumb (`desible.ai › Health › Claims Resolution`), tenant
  switcher pill (Insurer Client), green "Platform live" dot, amber "Demo
  Environment" pill
- Reusable component patterns, carried through every screen:
  - **Stat card:** coloured left border matching category, small-caps label,
    large number, sublabel with coloured trend arrow
  - **Status pill:** rounded badge (e.g. Healthy/Degraded, or a terminal
    state name)
  - **Anomaly banner:** light red background, warning icon, bold headline +
    one detail sentence, full width — for observability screens only
  - **Drop-off funnel:** horizontal segmented bar, orange→red gradient
  - No queue cards, no Approve/Override buttons, no SLA-countdown badges
    anywhere in the app — those imply pending human work, which this product
    doesn't have

---

## Sidebar structure

**DEMO** *(its own section, separate from the product)*
- Demo Console

**ANALYTICS**
- Executive Dashboard
- Rejection Reason Analytics
- Next-Step Analytics
- Sentiment & Distress Analytics

**CALLS**
- Call Log

**OBSERVABILITY**
- Workflow Observability
- Channel Observability

**COMPLIANCE**
- Compliance & QA Console

**CUSTOMER**
- Claimant 360

---

## Domain grounding

Indian health insurance / TPA vocabulary, ₹, DD Mon YYYY dates:

- **TPA** = Third Party Administrator, processes and settles health claims on
  behalf of the insurer
- **Pre-authorization** = approval required before planned treatment at a
  network hospital, or before treatment at a non-network hospital for
  reimbursement
- **Sub-limit** = a cap on a specific expense category (e.g. room rent);
  breaching it causes a *partial* rejection of the excess, not the whole claim
- **Non-disclosure** = claimant did not declare a pre-existing condition at
  proposal stage — the highest compliance-risk rejection category, since a
  claimant disputing it is effectively alleging mis-selling
- **Grievance Cell** = the claimant's regulatory recourse if they dispute a
  rejection. This dashboard can only show that a call **flagged** an
  escalation — not whether the grievance was later resolved, since that lives
  in a different system
- **TRAI calling window** — commercial calls illustratively restricted to
  9 AM–7 PM local time in this build; treat as a configurable demo value, not
  an asserted current regulation (source guidance conflicts on exact hours
  for AI-originated calls — confirm with legal before using real figures)
- Max call attempts per claimant per day: illustratively capped at 3

---

## Rejection reason categories (used consistently everywhere)

1. Pre-Existing Disease — Waiting Period Not Completed
2. Non-Disclosure at Proposal Stage
3. Treatment Excluded Under Policy
4. Policy Lapsed / Inactive at Hospitalization
5. Incomplete / Insufficient Documentation
6. Non-Network Hospital Without Pre-Authorization
7. Claim Filed Beyond Permissible Time Limit
8. Room Rent Sub-Limit Exceeded (Partial Rejection)
9. Fraud Investigation Pending
10. Treatment Not Medically Justified (TPA Doctor Review)

**Mock data grounding** (illustrative proportions to make volumes realistic,
loosely informed by industry-reported patterns — not exact published
figures): Non-Disclosure ~20%, Waiting Period ~20%, Room Rent Sub-Limit ~20%,
Treatment Excluded ~15%, Documentation ~12%, Non-Network/No Pre-Auth ~8%,
Policy Lapsed ~3%, Claim Filed Late ~1%, Fraud Investigation Pending ~1%.
Connect rate should be materially higher than a cold-outbound benchmark,
since these are existing claimants with a known-good number and an active
claim — target 55–70% in mock data, not the 15–25% cold-sales range.

---

## Claim storylines (mock data, reused consistently everywhere)

1. **CLM-H10432 — Anjali Verma**, 34 — Cataract surgery — ₹68,400 —
   Rejected: **Non-Network Hospital Without Pre-Authorization** —
   **flagship, fully runnable** — sentiment moves Concerned → Distressed —
   terminal state: Appeal Guidance Given
2. **CLM-H10488 — Rajeev Menon**, 58 — Cardiac angioplasty — ₹3,42,000 —
   Rejected: **Non-Disclosure at Proposal Stage** — **flagship, fully
   runnable** — claimant disputes the exclusion was ever explained —
   terminal state: Grievance Flagged
3. **CLM-H10517 — Fatima Sheikh** — Maternity claim — ₹52,000 — Rejected:
   Waiting Period Not Completed — terminal state: Reason Confirmed — Closed
4. **CLM-H10556 — Suresh Iyer** — Knee replacement — ₹2,10,000 — Rejected:
   Room Rent Sub-Limit Exceeded (partial) — terminal state: Appeal Guidance
   Given
5. **CLM-H10602 — Priya Nair** — Dengue hospitalization — ₹34,000 —
   Rejected: Incomplete Documentation — unreachable twice on Voice, reached
   via WhatsApp fallback — terminal state: Reason Confirmed — Closed
6. **CLM-H10649 — Arjun Bose**, 71 — Vitrectomy — ₹18,500 — Rejected:
   Treatment Excluded Under Policy — vulnerability flagged mid-call —
   terminal state: Escalated — Vulnerability

Plus ~15 additional mock claims in the Call Log for volume realism
(CLM-H106xx–CLM-H108xx), spanning all ten rejection categories with a real
terminal state and call metadata each, matching the proportions above.

---

## Terminal states & disposition vocabulary

Reuse this exact vocabulary across Call Detail, the Call Log, and the
Compliance & QA Console:

**Terminal states** (assigned by the call itself, nothing downstream):
- Reason Confirmed — Closed
- Reason Confirmed — Appeal Guidance Given
- Grievance Flagged
- Escalated — Vulnerability
- Unreachable — Retries Exhausted

**Sub-remarks** (nested detail): Comprehension Confirmed First Attempt /
Comprehension Confirmed After Repeat / Dispute Raised / No Response Given

**QA failure tags** (Compliance & QA Console): **FLOW ISSUE** (agent skipped
the comprehension check, or assigned the wrong terminal state for what
actually happened on the call) vs. **CLASSIFIER ISSUE** (customer's spoken
intent was misread by the system)

---

## The 5-phase call journey

Read-only visualization inside Call Detail — no edit mode, no node
inspector, no workflow-building affordance anywhere in this build.

```
type CallPhase = {
  id: string;
  label: string;
  subAgents: { name: string; role: string }[];
  status: "idle" | "active" | "done";
};
```

1. **Claim Rejected — Notification Queued** — Claims Data Sync Agent pulls
   rejection reason + policy clause reference
2. **Outreach Attempt** — Voice Agent places the call; Channel Orchestrator
   escalates Voice → SMS → WhatsApp → Email on no-answer; vulnerability
   screening happens here
3. **Reason Explained & Comprehension Check** — agent states the rejection
   reason mapped to the policy clause, asks a comprehension-confirmation
   question; Sentiment Agent scores distress throughout
4. **Next-Step Communicated** — branches on the customer's spoken response:
   accepts and wants appeal steps, disputes the reason, or gives no
   response
5. **Terminal State Assigned** — the call's own disposition, closing the
   record

**Layout:** `dagre` (`@dagrejs/dagre`), left-to-right, `fitView` on mount and
resize, visible zoom controls. Build with `@xyflow/react`.

**Run mode only:** nodes animate `idle → active → done`, paced 700–900ms
between log lines, when "Run live call playback" is used. No pause states,
no decision cards — the call runs end to end, because there's no human
step to pause for.

---

## Demo Console

Its own sidebar section, separate from the product.

- **Insurer Client** dropdown: Star Health / Niva Bupa / HDFC ERGO Health
- **Rejection Category** dropdown: the 10 categories above
- **"Load Sample Call"** button — navigates to the corresponding flagship
  claim's Call Detail page with "Run live call playback" ready

---

## Executive Dashboard

- Header: "Claims Rejection Resolution — Executive Dashboard." Subtitle:
  "ArogyaLink TPA · Jun 2026"
- **Row 1 — 6 primary KPI cards:** Rejection Calls (Today/MTD), Connect Rate,
  Successful Notification Rate, Comprehension Confirmed Rate, Appeal
  Guidance Given Rate, Grievance Flagged Rate
- **Row 2 — 3 system health cards:** Voice Channel API (status + latency),
  Compliance Engine (call-derived flags today), AI Agent Registry (agent
  count + uptime)
- **Terminal State Trend** — 12-week stacked area across the 5 terminal
  states
- **Rejection Reason Breakdown** — bar/donut across the 10 categories, %
  of call volume
- **Call Delivery Funnel** — 6-stage: Attempted → Connected → Right-Party
  Confirmed → Reason Explained → Comprehension Confirmed → Terminal State
  Assigned
- **Distress Rate by Rejection Category** — bar chart
- **Rejection concentration by state** — India choropleth-style grid, tiles
  coloured by call volume (state derived from claimant record on the call)
- **Highest-value, highest-distress calls this week** — table, sortable by
  value or distress score, both call-derived fields — no SLA column

---

## Rejection Reason Analytics

- Filter pills: Date Range, Rejection Category, Claim Value Band, Insurer
- Reason-by-month stacked bar, all 10 categories
- Two summary stats: Comprehension Confirmed Rate by category, Distress Rate
  by category
- Table: category, call volume, avg value communicated, appeal-guidance-given
  rate, grievance-flagged rate — all call-derived, no overturn/recovery
  column

---

## Next-Step Analytics

*(replaces "Appeal & Recovery Analytics" — renamed because everything past
this call's own terminal state is out of scope)*

- Terminal-state funnel: Rejected → Reason Confirmed → (Appeal Guidance
  Given / Grievance Flagged / Closed — No Further Action / Escalated —
  Vulnerability)
- Appeal Guidance Given rate — trend over time
- Grievance Flagged rate — trend over time
- Both cross-referenced by rejection category (bar, category × terminal
  state mix)

---

## Sentiment & Distress Analytics

- Distress rate trend (% of calls reaching Distressed or worse)
- Sentiment distribution: Calm / Concerned / Distressed / Angry
- Distress rate by rejection category (expect Non-Disclosure and Fraud
  Investigation Pending to run highest)
- Distress trajectory shape — % of calls that start neutral/calm and shift
  negative mid-call vs. calls that start negative and are de-escalated by
  call end (both patterns are visible from the call's own sentiment
  timeline)

---

## Call Log

*(replaces "Rejection Call Queue" — this is a read-only log, not a work
queue)*

- Sortable columns: Claim ID, Claimant, Rejection Category, Value, Terminal
  State, Call Date, Distress Level
- Filter bar: Rejection Category, Terminal State, Distress Flag
- No checkbox column, no bulk actions, no "Assign"/"Escalate" row actions —
  click a row to open Call Detail
- Every row shows its real terminal state, consistent with Call Detail

---

## Call Detail

Three tabs: **Overview** · **Transcript** · **Disposition & QA**.

**Every claim shows its actual current state immediately on open:**
- Overview: claimant facts, claim facts (treatment, hospital — generic
  fictional name — TPA, insurer, rejection reason with policy clause
  reference), call timeline (queued → attempted → connected → resolved),
  and what next-step guidance was given on the call (read-only — this is
  call content, not a live checklist)
- Transcript: turn-by-turn bubbles, timestamps, key moments highlighted
  inline (reason stated, comprehension check, distress spike), sentiment
  line beneath the transcript tracking the call's duration
- Disposition & QA: Terminal State + Sub-Remark, QA failure tags if any
  (FLOW ISSUE / CLASSIFIER ISSUE), rejection-reason-accuracy check (stated
  reason vs. system ground truth — flag mismatches), disclosure-adherence
  checklist (recording disclosure given / policy clause cited / right-to-
  dispute mentioned), prohibited-language scan result

**"Run live call playback" is exclusive to CLM-H10432 and CLM-H10488** — the
two flagship claims. Running it animates through all 5 phases with the
pacing above, ending at each claim's real terminal state. No pause, no
decision card — it's playback, not simulation of a choice point.

Every other claim shows its real static state with no playback prompt.

---

## Workflow Observability

**Aggregate tab:** per-workflow cards — Initial Rejection Notification,
Retry & Channel Escalation Cascade, Appeal Guidance Delivery, Grievance
Flagging, Vulnerable Customer Priority Track — each with Active Instances,
Completion Rate, Avg Time, Cost (7d), status pill, drop-off funnel.

**Instance View tab:** table of individual call runs — claim ID, workflow,
current phase, status, duration.

---

## Channel Observability

Per-channel cards — Voice, SMS, WhatsApp, Email — status pill, latency,
success rate, volume today. Anomaly banner reused for a degraded channel.

---

## Compliance & QA Console

Every metric here is derived from reviewing the call itself — no grievance-
resolution tracking, no delivery confirmation for outbound SMS/email:

- Two headline stats: **Terminal State Match rate**, **Sub-Remark Match
  rate** (sampled calls where the logged disposition matches what actually
  happened on the transcript)
- Failure tag breakdown donut: FLOW ISSUE vs. CLASSIFIER ISSUE
- **Rejection Reason Accuracy panel** — sampled calls where the stated
  reason matched system ground truth vs. mismatched, each linking to its
  Call Detail
- **Disclosure Adherence Rate** — % of calls where required disclosures
  were actually said (recording notice, policy clause cited, right-to-
  dispute mentioned)
- **Prohibited Language Scan** — flagged instances (e.g. "agent implied
  appeal will succeed," "agent speculated about fraud without basis"), each
  linking to its transcript moment
- **Calling-Window Compliance** — % of calls placed inside the illustrative
  9 AM–7 PM window
- **Max-Attempt Compliance** — % of claimants not exceeding the illustrative
  3-attempts-per-day cap
- Searchable log: timestamp, claim, terminal state, QA flags, all filterable

---

## Claimant 360

- Profile: name, age, policy number, TPA, insurer, communication preference
- Claim history (a claimant may have more than one claim)
- Past call log — terminal state, date, distress level, link to Call Detail
- Pattern tags derived purely from call history — e.g. "Repeat rejection
  contact," "Elevated distress across last 3 calls"

---

## Copy standard

No marketing language, no explanatory captions, no placeholder-sounding
text. ₹ throughout, DD Mon YYYY dates. Reuse claim IDs, names, and figures
established above. Hospital names generic/fictional — never real hospital
brands. Insurer names may use the real Indian health insurers listed in the
Demo Console as selectable demo values only. No SLA countdowns, no
Approve/Override affordances, no "assign to me" language anywhere — this is
a reporting product, not a work-management one.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://voice-resolve-view.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7594a0c3-b309-448f-a955-20fe0529626a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
