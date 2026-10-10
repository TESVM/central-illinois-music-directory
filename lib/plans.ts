/**
 * Membership catalog — the single source of truth for plans, prices, trials,
 * and what each tier includes.
 *
 * Everything the pricing page, upgrade prompts, and (later) Stripe and the
 * admin dashboard need comes from here. When the admin dashboard lands it will
 * edit these records rather than introduce a second place prices can live.
 *
 * Prices are stored in whole US dollars. Annual billing is priced at ten
 * months, so "two months free" is literally true rather than a rounded claim.
 */

export type Audience = "musician" | "group" | "church";

export type PlanId =
  | "musician-free"
  | "musician-pro"
  | "musician-premium"
  | "group-pro"
  | "church-free"
  | "church-pro"
  | "church-partner";

export type Plan = {
  id: PlanId;
  audience: Audience;
  name: string;
  /** One line under the plan name on the pricing card. */
  bestFor: string;
  monthly: number;
  annual: number;
  /** Set to 0 to disable the trial for this plan. Admin-configurable later. */
  trialDays: number;
  /** Visually emphasised on the pricing page. At most one per audience. */
  highlighted?: boolean;
  /** Inherits every feature of this plan, rendered as "Everything in X, plus". */
  inheritsFrom?: PlanId;
  features: string[];
  /** Shown in smaller text beneath the feature list. */
  caveat?: string;
};

/** Annual billing costs this many months. Ten means two months free. */
const ANNUAL_MONTHS = 10;

const annual = (monthly: number) => monthly * ANNUAL_MONTHS;

export const PLANS: Plan[] = [
  // ── Musicians ──────────────────────────────────────────────────────────
  {
    id: "musician-free",
    audience: "musician",
    name: "Free Profile",
    bestFor: "Any musician who wants to be found by local churches.",
    monthly: 0,
    annual: 0,
    trialDays: 0,
    features: [
      "Listed in the public directory",
      "Professional photo, name, and short bio",
      "Up to 3 instruments or talents",
      "City and travel area",
      "Up to 2 audio or video samples",
      "Basic availability status",
      "Contact-request form",
      "Save opportunities you're interested in",
      "Respond to up to 3 opportunities a month",
      "Search churches and open opportunities"
    ],
    caveat: "Free for as long as you want it. No card required."
  },
  {
    id: "musician-pro",
    audience: "musician",
    name: "Musician Pro",
    bestFor: "Musicians who want to be seen first and booked more often.",
    monthly: 12,
    annual: annual(12),
    trialDays: 14,
    highlighted: true,
    inheritsFrom: "musician-free",
    features: [
      "Priority placement in relevant searches",
      "Eligible to be a Featured Musician",
      "Unlimited instruments, talents, and ministry skills",
      "Unlimited audio and video samples",
      "Testimonials and references section",
      "Verified badge after review",
      "Show your compensation preference — paid, honorarium, volunteer, or discuss",
      "Advanced availability calendar",
      "Instant alerts for opportunities matching your gifts and area",
      "Unlimited opportunity responses",
      "Profile analytics — views, saves, and contact requests",
      "Custom profile link",
      "Downloadable one-sheet booking profile",
      "Appear in the Available This Week section",
      "Priority support"
    ],
    caveat:
      "Upgraded visibility helps churches discover you. It does not guarantee bookings or ministry opportunities."
  },
  {
    id: "musician-premium",
    audience: "musician",
    name: "Ministry Partner",
    bestFor: "Full-time and heavily booked musicians managing steady work.",
    monthly: 24,
    annual: annual(24),
    trialDays: 14,
    inheritsFrom: "musician-pro",
    features: [
      "Top placement in local searches, clearly labeled as Featured",
      "Homepage and featured-category rotation",
      "Monthly profile and media review assistance",
      "One promoted response boost each month",
      "Detailed booking and inquiry dashboard",
      "Automated follow-up reminders for church inquiries",
      "Add a team member or assistant to manage bookings",
      "Multiple service areas",
      "Priority consideration for spotlights and email features"
    ],
    caveat:
      "Featured placement is always labeled as promoted. It does not guarantee bookings or ministry opportunities."
  },

  // ── Groups ─────────────────────────────────────────────────────────────
  {
    id: "group-pro",
    audience: "group",
    name: "Group Pro",
    bestFor: "Praise teams, choirs, bands, gospel groups, and production teams.",
    monthly: 29,
    annual: annual(29),
    trialDays: 14,
    highlighted: true,
    features: [
      "Group profile with logo, photos, and member roster",
      "Multiple talent categories",
      "Extended audio and video samples",
      "Shared team booking calendar",
      "Multiple administrators",
      "Eligible to be a Featured Group",
      "Group analytics",
      "Service-area and travel settings",
      "Respond to group-level opportunities",
      "Downloadable ministry and booking kit",
      "Priority placement in team searches"
    ],
    caveat:
      "One subscription covers the whole group. Individual members keep their own free profiles."
  },

  // ── Churches and ministries ────────────────────────────────────────────
  {
    id: "church-free",
    audience: "church",
    name: "Free Account",
    bestFor: "Churches filling an occasional gap on the schedule.",
    monthly: 0,
    annual: 0,
    trialDays: 0,
    features: [
      "Claim or create your church profile",
      "Search musicians, groups, and production teams",
      "Save profiles you like",
      "One active opportunity at a time",
      "Receive responses through a secure form",
      "List your music-ministry needs",
      "Connect to your Champaign County Churches listing"
    ],
    caveat: "Free for as long as you want it. No card required."
  },
  {
    id: "church-pro",
    audience: "church",
    name: "Church Pro",
    bestFor: "Churches booking musicians regularly across the year.",
    monthly: 29,
    annual: annual(29),
    trialDays: 14,
    highlighted: true,
    inheritsFrom: "church-free",
    features: [
      "Multiple active opportunities",
      "Priority placement for your listings",
      "Advanced filters — availability, travel distance, event type, compensation, worship style, and verification",
      "Suggested musician matches after you post",
      "Invite musicians directly",
      "Team dashboard with multiple staff accounts",
      "Saved talent lists — Sunday substitutes, funeral musicians, youth team",
      "Opportunity analytics — views, saves, and responses",
      "Event scheduling and inquiry management",
      "Eligible to be a Featured Church",
      "Priority support"
    ]
  },
  {
    id: "church-partner",
    audience: "church",
    name: "Ministry Network",
    bestFor: "Multi-campus churches, conferences, and frequent event hosts.",
    monthly: 69,
    annual: annual(69),
    trialDays: 14,
    inheritsFrom: "church-pro",
    features: [
      "Unlimited active opportunities",
      "Featured organization placement",
      "Advanced talent-request forms",
      "Multiple campuses and locations",
      "Multiple ministry departments",
      "Role permissions — worship pastor, music director, admin, event planner",
      "Priority matching support",
      "Monthly featured opportunity in the newsletter",
      "Reporting dashboard for hiring activity and response rates",
      "Bulk outreach tools with responsible sending limits",
      "Dedicated onboarding"
    ]
  }
];

export const AUDIENCES: Array<{ id: Audience; label: string; blurb: string }> = [
  {
    id: "musician",
    label: "Musicians",
    blurb: "Individual players, singers, directors, and accompanists."
  },
  {
    id: "group",
    label: "Groups & teams",
    blurb: "Praise teams, choirs, bands, and production teams."
  },
  {
    id: "church",
    label: "Churches",
    blurb: "Churches, ministries, and event planners who book musicians."
  }
];

export function plansFor(audience: Audience): Plan[] {
  return PLANS.filter((plan) => plan.audience === audience);
}

export function getPlan(id: PlanId): Plan | undefined {
  return PLANS.find((plan) => plan.id === id);
}

/** Monthly-equivalent cost when billed annually. */
export function monthlyEquivalent(plan: Plan): number {
  return plan.annual === 0 ? 0 : plan.annual / 12;
}

/** Dollars saved per year by paying annually. */
export function annualSavings(plan: Plan): number {
  return plan.monthly * 12 - plan.annual;
}

export function isFree(plan: Plan): boolean {
  return plan.monthly === 0 && plan.annual === 0;
}

/**
 * Every feature a plan grants, including inherited ones. Used by the
 * comparison table, where "Everything in Pro, plus" is not specific enough.
 */
export function resolvedFeatures(plan: Plan): string[] {
  const parent = plan.inheritsFrom ? getPlan(plan.inheritsFrom) : undefined;
  return parent ? [...resolvedFeatures(parent), ...plan.features] : [...plan.features];
}

/**
 * Subscription billing is not connected yet.
 *
 * While this is false, paid plans are shown as upcoming and their buttons
 * register interest instead of starting a checkout that cannot complete.
 * Flip it on once Stripe, accounts, and the entitlement checks are in place —
 * never before, or the page promises something it cannot deliver.
 */
export const BILLING_LIVE = false;

/**
 * Promoted placement must never masquerade as neutral ranking. Any surface
 * that orders results by paid tier shows this label.
 */
export const PROMOTED_LABEL = "Featured";
export const PROMOTED_EXPLAINER =
  "Featured profiles are part of a paid membership. They are always labeled, and never mixed silently into ranking.";
