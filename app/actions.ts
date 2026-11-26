"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  contactSchema,
  claimSchema,
  gigRequestSchema,
  musicianProfileSchema,
  submitListingSchema,
  type GigRequestInput,
  type MusicianProfileInput
} from "@/lib/validation/forms";
import { getPlan, type PlanId } from "@/lib/plans";
import { computeQuote, enforceFloor, quoteToPlainText } from "@/lib/rates";
import { sendGigNotification } from "@/lib/notify";
import { checkRateLimit, describeRetry } from "@/lib/rate-limit";
import { recordNotificationResult, recordSubmission } from "@/lib/data/submissions";
import {
  createPersistedClaimRequest,
  reviewPersistedClaimRequest,
  saveSiteContentRecord
} from "@/lib/data/admin-store";

export type FormResult = {
  status: "idle" | "success" | "error";
  message: string;
  /** True only when the email provider accepted the notification. */
  delivered?: boolean;
  /** Set when the submission was refused by the rate limiter. */
  retryAfterSeconds?: number;
};

const CONTACT_EMAIL = "hello@centralilmusicministry.com";

/**
 * Per-form submission limits. Generous enough that nobody filling in a form
 * honestly will hit them, tight enough that a script cannot drain the monthly
 * email quota.
 */
const LIMITS = {
  contact: { limit: 5, windowSeconds: 600 },
  profile: { limit: 3, windowSeconds: 3600 },
  listing: { limit: 3, windowSeconds: 3600 },
  gig: { limit: 5, windowSeconds: 3600 }
} as const;

/** Returns a FormResult when the caller is over the limit, otherwise null. */
async function guardRate(action: keyof typeof LIMITS): Promise<FormResult | null> {
  const verdict = await checkRateLimit(action, LIMITS[action]);
  if (verdict.allowed) return null;

  return {
    status: "error",
    message: `That's a few submissions in a short time. Please wait ${describeRetry(
      verdict.retryAfterSeconds
    )} and try again — or email ${CONTACT_EMAIL} if it's urgent.`,
    retryAfterSeconds: verdict.retryAfterSeconds
  };
}

/**
 * Turns a delivery attempt into the result the user sees.
 *
 * Nothing is stored durably yet, so the notification email IS the record. If
 * the provider did not accept it, the submission is gone — reporting that as
 * success would tell someone their enquiry was received when it was lost.
 * Success is therefore gated on delivery, and failure gives the person a route
 * that actually works.
 *
 * Once submissions are persisted, this should report receipt from the saved
 * record and track delivery separately.
 */
function deliveryOutcome(
  delivery: Awaited<ReturnType<typeof sendGigNotification>>,
  successMessage: string,
  whatWasSent: string,
  stored = false
): FormResult {
  if (delivery.delivered) {
    return { status: "success", message: successMessage, delivered: true };
  }

  /*
   * Once the submission is saved, receipt is a fact independent of email.
   * Reporting failure then would be wrong in the other direction — the
   * enquiry is safely recorded and someone will see it in the queue.
   */
  if (stored) {
    return {
      status: "success",
      message: `${successMessage} (Our email notification is having trouble, so if you don't hear back within a day, email ${CONTACT_EMAIL}.)`,
      delivered: false
    };
  }

  const because =
    delivery.reason === "not_configured" || delivery.reason === "no_recipient"
      ? "Our notification system isn't finished being set up"
      : "We couldn't get your message through just now";

  return {
    status: "error",
    message: `${because}, so ${whatWasSent} was not delivered. Please email ${CONTACT_EMAIL} directly and we'll pick it up from there. Nothing you typed was sent.`,
    delivered: false
  };
}

/**
 * Contact form. Previously this validated the input and then discarded it —
 * every message sent through the site was silently lost.
 */
export async function submitContactAction(
  _previous: FormResult,
  formData: FormData
): Promise<FormResult> {
  const limited = await guardRate("contact");
  if (limited) return limited;

  const organization = formData.get("organization")?.toString().trim() || undefined;

  // Set by the pricing page's "tell me when this launches" buttons. Validated
  // against the catalog so a crafted query value is never echoed into email.
  const rawInterest = formData.get("interest")?.toString();
  const interestedPlan = rawInterest ? getPlan(rawInterest as PlanId) : undefined;

  const rawMessage = formData.get("message")?.toString().trim() ?? "";

  // Registering interest in a plan is a complete request on its own, so it
  // does not have to clear the free-text minimum.
  const message =
    rawMessage.length > 0
      ? rawMessage
      : interestedPlan
        ? `Please notify me when ${interestedPlan.name} is available.`
        : rawMessage;

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message
  });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        "Please check the form: a name, a valid email address, and a message of at least 10 characters are required."
    };
  }

  const { name, email } = parsed.data;

  console.info(
    "[contact]",
    JSON.stringify({
      receivedAt: new Date().toISOString(),
      name,
      email,
      organization,
      interest: interestedPlan?.id,
      message: parsed.data.message
    })
  );

  const contactSummary = [
    `From: ${name} <${email}>`,
    organization ? `Organization: ${organization}` : "",
    interestedPlan ? `Interested in: ${interestedPlan.name} (${interestedPlan.id})` : "",
    "",
    parsed.data.message
  ]
    .filter(Boolean)
    .join("\n");

  // Saved before the email is attempted, so a provider outage cannot lose it.
  const record = await recordSubmission({
    kind: "CONTACT",
    contactName: name,
    contactEmail: email,
    organization,
    payload: { ...parsed.data, organization, interest: interestedPlan?.id },
    summary: contactSummary
  });

  const delivery = await sendGigNotification({
    subject: interestedPlan
      ? `Membership interest (${interestedPlan.name}) — ${name}`
      : `Contact form — ${name}`,
    body: [
      `From: ${name} <${email}>`,
      organization ? `Organization: ${organization}` : "",
      interestedPlan ? `Interested in: ${interestedPlan.name} (${interestedPlan.id})` : "",
      "",
      parsed.data.message
    ]
      .filter(Boolean)
      .join("\n"),
    replyTo: email
  });

  if (record.stored) {
    await recordNotificationResult(record.id, {
      delivered: delivery.delivered,
      detail: delivery.delivered ? undefined : delivery.reason
    });
  }

  return deliveryOutcome(
    delivery,
    "Thanks — your message is on its way. We'll reply to the email you gave us.",
    "your message",
    record.stored
  );
}

/**
 * Musician profile submission.
 *
 * The previous version cleared a localStorage draft and told the musician the
 * profile was "submitted successfully" without sending it anywhere.
 */
export async function submitMusicianProfileAction(
  input: MusicianProfileInput
): Promise<FormResult> {
  const limited = await guardRate("profile");
  if (limited) return limited;

  const parsed = musicianProfileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Some required details are missing or too short. Check the highlighted steps."
    };
  }

  const profile = parsed.data;

  console.info(
    "[musician-profile]",
    JSON.stringify({ receivedAt: new Date().toISOString(), ...profile })
  );

  const profileSummary = [
    `${profile.fullName} — ${profile.primaryRole}, ${profile.city}`,
    `${profile.yearsExperience} years · ${profile.genres}`,
    `Reply to: ${profile.email}`
  ].join("\n");

  const record = await recordSubmission({
    kind: "MUSICIAN_PROFILE",
    contactName: profile.fullName,
    contactEmail: profile.email,
    payload: profile,
    summary: profileSummary
  });

  const delivery = await sendGigNotification({
    subject: `New musician profile — ${profile.fullName}`,
    body: [
      `Name:        ${profile.fullName}`,
      `Role:        ${profile.primaryRole}`,
      `City:        ${profile.city}`,
      `Experience:  ${profile.yearsExperience}`,
      `Genres:      ${profile.genres}`,
      `Availability:${profile.availability || " not given"}`,
      `Email:       ${profile.email}`,
      `Phone:       ${profile.phone}`,
      `WhatsApp:    ${profile.whatsapp || "not given"}`,
      `Facebook:    ${profile.facebook || "not given"}`,
      `Instagram:   ${profile.instagram || "not given"}`,
      `LinkedIn:    ${profile.linkedin || "not given"}`,
      `Churches:    ${profile.churches || "not given"}`,
      `Events:      ${profile.events || "not given"}`,
      `Media:       ${profile.media || "not given"}`,
      "",
      "Bio:",
      profile.bio
    ].join("\n"),
    replyTo: profile.email
  });

  if (record.stored) {
    await recordNotificationResult(record.id, {
      delivered: delivery.delivered,
      detail: delivery.delivered ? undefined : delivery.reason
    });
  }

  return deliveryOutcome(
    delivery,
    "Profile received. We'll review it and get in touch before it goes live.",
    "your profile",
    record.stored
  );
}

/**
 * Church listing submission.
 *
 * This previously validated the input and returned, discarding every listing
 * anyone submitted for review.
 */
export async function submitListingAction(
  _previous: FormResult,
  formData: FormData
): Promise<FormResult> {
  const limited = await guardRate("listing");
  if (limited) return limited;

  const parsed = submitListingSchema.safeParse({
    churchName: formData.get("churchName"),
    city: formData.get("city"),
    contactName: formData.get("contactName"),
    contactEmail: formData.get("contactEmail"),
    websiteUrl: formData.get("websiteUrl"),
    appUrl: formData.get("appUrl"),
    seniorPastor: formData.get("seniorPastor"),
    serviceTimes: formData.get("serviceTimes"),
    description: formData.get("description")
  });

  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((issue) => issue.path.join("."))
      .filter(Boolean);
    return {
      status: "error",
      message: missing.length
        ? `Please check these fields: ${[...new Set(missing)].join(", ")}.`
        : "Some required details are missing. Please review the form."
    };
  }

  const listing = parsed.data;

  console.info(
    "[church-listing]",
    JSON.stringify({ receivedAt: new Date().toISOString(), ...listing })
  );

  const listingSummary = [
    `${listing.churchName}, ${listing.city}`,
    `Pastor ${listing.seniorPastor} · ${listing.serviceTimes}`,
    `Submitted by ${listing.contactName} <${listing.contactEmail}>`
  ].join("\n");

  const record = await recordSubmission({
    kind: "CHURCH_LISTING",
    contactName: listing.contactName,
    contactEmail: listing.contactEmail,
    organization: listing.churchName,
    payload: listing,
    summary: listingSummary
  });

  const delivery = await sendGigNotification({
    subject: `Church listing submitted — ${listing.churchName}`,
    body: [
      `Church:        ${listing.churchName}`,
      `City:          ${listing.city}`,
      `Senior pastor: ${listing.seniorPastor}`,
      `Service times: ${listing.serviceTimes}`,
      `Website:       ${listing.websiteUrl || "not given"}`,
      `App:           ${listing.appUrl || "not given"}`,
      "",
      `Submitted by:  ${listing.contactName} <${listing.contactEmail}>`,
      "",
      "Description:",
      listing.description
    ].join("\n"),
    replyTo: listing.contactEmail
  });

  if (record.stored) {
    await recordNotificationResult(record.id, {
      delivered: delivery.delivered,
      detail: delivery.delivered ? undefined : delivery.reason
    });
  }

  return deliveryOutcome(
    delivery,
    "Listing received. We'll review it before it appears in the directory.",
    "your listing",
    record.stored
  );
}

/**
 * Receives a gig request from an organization.
 *
 * The request is validated and re-priced server-side — a total computed in the
 * browser is never trusted. It is then written to the server log (readable in
 * the Vercel dashboard) and emailed if a provider is configured.
 *
 * `delivered` is returned honestly so the confirmation screen can prompt the
 * organization to send a copy themselves when no mail provider is set up.
 */
export type GigRequestResult =
  | { ok: true; quote: ReturnType<typeof computeQuote>; summary: string }
  | { ok: false; message: string; retryAfterSeconds?: number };

export async function submitGigRequestAction(
  input: GigRequestInput
): Promise<GigRequestResult> {
  const limited = await guardRate("gig");
  if (limited) {
    return {
      ok: false,
      message: limited.message,
      retryAfterSeconds: limited.retryAfterSeconds
    };
  }

  const validated = gigRequestSchema.safeParse(input);
  if (!validated.success) {
    return {
      ok: false,
      message:
        "Some of the request details didn't look right. Please check the form and try again."
    };
  }
  const payload = validated.data;

  const quote = computeQuote({
    hourlyRate: enforceFloor(payload.hourlyRate),
    hours: payload.hours,
    musicians: payload.musicians,
    travelMiles: payload.travelMiles,
    equipmentFee: payload.equipmentFee
  });

  console.info(
    "[gig-request]",
    JSON.stringify({
      receivedAt: new Date().toISOString(),
      organization: payload.organization,
      contactName: payload.contactName,
      contactEmail: payload.contactEmail,
      contactPhone: payload.contactPhone,
      eventType: payload.eventType,
      eventDate: payload.eventDate,
      startTime: payload.startTime,
      venue: payload.venue,
      instruments: payload.instruments,
      notes: payload.notes,
      quote
    })
  );

  const summary = [
    `New musician request from ${payload.organization}`,
    "",
    `Contact:  ${payload.contactName}`,
    `Email:    ${payload.contactEmail}`,
    `Phone:    ${payload.contactPhone || "not given"}`,
    `Event:    ${payload.eventType} on ${payload.eventDate}${payload.startTime ? ` at ${payload.startTime}` : ""}`,
    `Venue:    ${payload.venue}`,
    `Needs:    ${payload.instruments.join(", ")}`,
    payload.notes ? `Notes:    ${payload.notes}` : "",
    "",
    quoteToPlainText(quote, "Quoted estimate")
  ]
    .filter(Boolean)
    .join("\n");

  const record = await recordSubmission({
    kind: "GIG_REQUEST",
    contactName: payload.contactName,
    contactEmail: payload.contactEmail,
    organization: payload.organization,
    payload: { ...payload, quote },
    summary
  });

  const delivery = await sendGigNotification({
    subject: `Musician request — ${payload.organization} (${payload.eventDate})`,
    body: summary,
    replyTo: payload.contactEmail
  });

  if (record.stored) {
    await recordNotificationResult(record.id, {
      delivered: delivery.delivered,
      detail: delivery.delivered ? undefined : delivery.reason
    });
  }

  // Nothing is stored yet, so an undelivered notification means the request is
  // gone. Reporting success here would tell a church we had their booking when
  // we did not.
  // Stored requests are safe even if the notification failed; unstored ones
  // only existed in that email.
  if (!delivery.delivered && !record.stored) {
    return {
      ok: false,
      message:
        delivery.reason === "not_configured" || delivery.reason === "no_recipient"
          ? `Our notification system isn't finished being set up, so this request was not delivered. Please email ${CONTACT_EMAIL} and we'll arrange it directly.`
          : `We couldn't get your request through just now. Please email ${CONTACT_EMAIL} and we'll pick it up from there.`
    };
  }

  return { ok: true, quote, summary };
}

export async function claimListingAction(formData: FormData) {
  const payload = claimSchema.parse({
    churchName: formData.get("churchName"),
    churchSlug: formData.get("churchSlug"),
    contactName: formData.get("contactName"),
    contactEmail: formData.get("contactEmail"),
    role: formData.get("role"),
    verificationMethod: formData.get("verificationMethod"),
    phone: formData.get("phone"),
    evidence: formData.get("evidence"),
    message: formData.get("message")
  });

  await createPersistedClaimRequest({
    churchSlug: payload.churchSlug || undefined,
    churchName: payload.churchName,
    contactName: payload.contactName,
    contactEmail: payload.contactEmail,
    role: payload.role,
    verificationMethod: payload.verificationMethod,
    evidence: `${payload.evidence}\n\nContext: ${payload.message}`
  });

  redirect(`/claim?submitted=1${payload.churchSlug ? `&church=${payload.churchSlug}` : ""}`);
}

export async function reviewClaimRequestAction(formData: FormData) {
  const claimId = formData.get("claimId")?.toString();
  const decision = formData.get("decision")?.toString() as "APPROVED" | "MORE_INFO" | "DENIED" | undefined;
  const reviewerNote = formData.get("reviewerNote")?.toString();

  if (!claimId || !decision) {
    return;
  }

  await reviewPersistedClaimRequest({
    claimId,
    decision,
    reviewerNote
  });

  revalidatePath("/admin");
  revalidatePath("/admin/claims");
  revalidatePath("/dashboard");
}

export async function saveSiteContentAction(formData: FormData) {
  const key = formData.get("key")?.toString();
  const label = formData.get("label")?.toString();
  const value = formData.get("value")?.toString();
  const area = formData.get("area")?.toString() as "homepage" | "about" | "directory" | "global" | undefined;

  if (!key || !label || !value || !area) {
    return;
  }

  await saveSiteContentRecord({
    key,
    label,
    value,
    area
  });

  revalidatePath("/admin/content");
  revalidatePath("/");
  revalidatePath("/directory");
}
