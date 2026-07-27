/**
 * Single source of truth for every dollar figure on the site.
 *
 * The $35/hour floor is enforced here and nowhere else, so a musician rate can
 * never slip below it no matter which surface sets it — profile, calculator,
 * gig request, or a future contract.
 */

export const FLOOR_RATE = 35;

/** Minimum billable block. Nobody books a musician for fifteen minutes. */
export const MIN_HOURS = 1;

/** IRS standard mileage rate, 2026. Used for optional travel reimbursement. */
export const MILEAGE_RATE = 0.67;

/** What the directory keeps for coordinating the booking. */
export const DEFAULT_BROKER_PCT = 15;

export type RateTier = {
  id: string;
  label: string;
  rate: number;
  blurb: string;
};

/**
 * Reference tiers shown to organizations that don't have a specific musician
 * in mind yet. Real bookings use the musician's own `hourlyRate`.
 */
export const RATE_TIERS: RateTier[] = [
  {
    id: "standard",
    label: "Standard",
    rate: FLOOR_RATE,
    blurb: "Vocalists and rhythm players joining an existing set."
  },
  {
    id: "experienced",
    label: "Experienced",
    rate: 50,
    blurb: "Keys, strings, and horn players reading charts on short notice."
  },
  {
    id: "lead",
    label: "Lead / Director",
    rate: 75,
    blurb: "Worship leaders, music directors, and arrangers running the room."
  }
];

/** Clamp any rate to the floor. Non-numeric or missing input falls back to the floor. */
export function enforceFloor(rate: number | null | undefined): number {
  if (typeof rate !== "number" || !Number.isFinite(rate)) {
    return FLOOR_RATE;
  }
  return Math.max(rate, FLOOR_RATE);
}

/** True when a rate sits exactly at the published minimum. */
export function isFloorRate(rate: number): boolean {
  return enforceFloor(rate) === FLOOR_RATE;
}

export type QuoteInput = {
  hourlyRate: number;
  hours: number;
  musicians: number;
  /** Round-trip miles per musician. Zero means no travel reimbursement. */
  travelMiles?: number;
  /** Flat fee for backline, PA, or a piano tuning. */
  equipmentFee?: number;
  brokerPct?: number;
};

export type Quote = {
  hourlyRate: number;
  hours: number;
  musicians: number;
  atFloor: boolean;
  musicianPayout: number;
  travelTotal: number;
  equipmentFee: number;
  brokerFee: number;
  brokerPct: number;
  orgTotal: number;
  /** What one musician takes home, before their own taxes. */
  perMusician: number;
};

/**
 * Pure — safe to call from a server action, a page render, or the browser.
 * Every quote on the site, wherever it appears, comes out of this function.
 */
export function computeQuote(input: QuoteInput): Quote {
  const hourlyRate = enforceFloor(input.hourlyRate);
  const hours = Math.max(MIN_HOURS, input.hours || MIN_HOURS);
  const musicians = Math.max(1, Math.round(input.musicians || 1));
  const brokerPct = input.brokerPct ?? DEFAULT_BROKER_PCT;

  const musicianPayout = hourlyRate * hours * musicians;
  const travelTotal = round2((input.travelMiles ?? 0) * MILEAGE_RATE * musicians);
  const equipmentFee = input.equipmentFee ?? 0;

  const subtotal = musicianPayout + travelTotal + equipmentFee;
  const brokerFee = round2(subtotal * (brokerPct / 100));

  return {
    hourlyRate,
    hours,
    musicians,
    atFloor: isFloorRate(hourlyRate),
    musicianPayout,
    travelTotal,
    equipmentFee,
    brokerFee,
    brokerPct,
    orgTotal: round2(subtotal + brokerFee),
    perMusician: round2(hourlyRate * hours + (travelTotal ? travelTotal / musicians : 0))
  };
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** $1,234.50 — drops the cents when the amount is whole, which most are. */
export function formatCurrency(value: number): string {
  const whole = Number.isInteger(value);
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2
  });
}

/** "$35/hr" */
export function formatRate(rate: number): string {
  return `${formatCurrency(enforceFloor(rate))}/hr`;
}

/** Plain-text quote suitable for an email body or a clipboard paste. */
export function quoteToPlainText(quote: Quote, heading = "Gig estimate"): string {
  const lines = [
    heading,
    "Central Illinois Music Ministry Directory",
    "",
    `Musicians:        ${quote.musicians}`,
    `Duration:         ${quote.hours} hour${quote.hours === 1 ? "" : "s"}`,
    `Hourly rate:      ${formatRate(quote.hourlyRate)}${quote.atFloor ? " (published minimum)" : ""}`,
    `Musician pay:     ${formatCurrency(quote.musicianPayout)}`
  ];

  if (quote.travelTotal > 0) {
    lines.push(`Travel:           ${formatCurrency(quote.travelTotal)}`);
  }
  if (quote.equipmentFee > 0) {
    lines.push(`Equipment:        ${formatCurrency(quote.equipmentFee)}`);
  }

  lines.push(
    `Coordination fee: ${formatCurrency(quote.brokerFee)} (${quote.brokerPct}%)`,
    "",
    `Estimated total:  ${formatCurrency(quote.orgTotal)}`,
    "",
    "Estimate only. Final cost is confirmed before anyone is booked."
  );

  return lines.join("\n");
}
