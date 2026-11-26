import { z } from "zod";

/**
 * Upper bounds on every public input.
 *
 * Two reasons. First, ordinary hygiene: nothing here should ever be a
 * megabyte. Second, a compensating control for GHSA-mrhx-c7xc-m3w5 (zod can
 * exhaust memory validating oversized constrained collections) — the fix is
 * zod 4, a breaking upgrade not taken yet, so oversized payloads are rejected
 * on size before they reach expensive validation.
 *
 * Generous enough that no genuine submission is affected: SHORT fits a name or
 * a city, MEDIUM a sentence or a URL, LONG a full bio.
 */
const SHORT = 120;
const MEDIUM = 300;
const LONG = 5000;

const shortText = (min: number) => z.string().trim().min(min).max(SHORT);
const mediumText = (min: number) => z.string().trim().min(min).max(MEDIUM);
const longText = (min: number) => z.string().trim().min(min).max(LONG);

/** Optional free text that may be submitted empty. */
const optionalText = (max: number = MEDIUM) =>
  z.string().trim().max(max).optional().or(z.literal(""));

const optionalUrl = z.string().trim().url().max(MEDIUM).optional().or(z.literal(""));

const email = z.string().trim().email().max(SHORT);

export const contactSchema = z.object({
  name: shortText(2),
  email,
  message: longText(10)
});

export const submitListingSchema = z.object({
  churchName: shortText(2),
  city: shortText(2),
  contactName: shortText(2),
  contactEmail: email,
  websiteUrl: optionalUrl,
  appUrl: optionalUrl,
  seniorPastor: shortText(2),
  serviceTimes: mediumText(2),
  description: longText(20)
});

export const musicianProfileSchema = z.object({
  fullName: shortText(2),
  primaryRole: shortText(2),
  city: shortText(2),
  availability: optionalText(),
  yearsExperience: shortText(1),
  genres: mediumText(2),
  bio: longText(20),
  churches: optionalText(LONG),
  events: optionalText(LONG),
  phone: z.string().trim().min(7).max(40),
  email,
  whatsapp: optionalText(SHORT),
  facebook: optionalText(),
  instagram: optionalText(),
  linkedin: optionalText(),
  media: optionalText(LONG)
});

export type MusicianProfileInput = z.infer<typeof musicianProfileSchema>;

export const gigRequestSchema = z.object({
  organization: shortText(2),
  contactName: shortText(2),
  contactEmail: email,
  contactPhone: optionalText(40),
  eventType: shortText(2),
  eventDate: z.string().trim().min(4).max(40),
  startTime: optionalText(20),
  venue: mediumText(2),
  instruments: z
    .array(z.string().trim().max(SHORT))
    .min(1, "Pick at least one instrument")
    .max(30),
  hours: z.number().min(1).max(12),
  musicians: z.number().int().min(1).max(20),
  /*
   * Bounded above as well as below. The server re-prices every quote through
   * enforceFloor, so a client value cannot drop below the published minimum,
   * but an absurd upper value would still reach the notification email.
   */
  hourlyRate: z.number().min(1).max(1000),
  travelMiles: z.number().min(0).max(500),
  equipmentFee: z.number().min(0).max(5000),
  notes: optionalText(LONG)
});

export type GigRequestInput = z.infer<typeof gigRequestSchema>;

export const claimSchema = z.object({
  churchName: shortText(2),
  churchSlug: optionalText(SHORT),
  contactName: shortText(2),
  contactEmail: email,
  role: shortText(2),
  verificationMethod: z.enum(["DOMAIN_EMAIL", "PUBLIC_PHONE", "MANUAL_REVIEW"]),
  phone: optionalText(40),
  evidence: longText(10),
  message: longText(10)
});
