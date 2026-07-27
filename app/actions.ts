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
import { computeQuote, enforceFloor, quoteToPlainText } from "@/lib/rates";
import { sendGigNotification } from "@/lib/notify";
import {
  createPersistedClaimRequest,
  reviewPersistedClaimRequest,
  saveSiteContentRecord
} from "@/lib/data/admin-store";

export type FormResult = {
  status: "idle" | "success" | "error";
  message: string;
  /** False when no mail provider is configured, so the UI can say so plainly. */
  delivered?: boolean;
};

/**
 * Contact form. Previously this validated the input and then discarded it —
 * every message sent through the site was silently lost.
 */
export async function submitContactAction(
  _previous: FormResult,
  formData: FormData
): Promise<FormResult> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message")
  });

  if (!parsed.success) {
    return {
      status: "error",
      message:
        "Please check the form: a name, a valid email address, and a message of at least 10 characters are required."
    };
  }

  const { name, email, message } = parsed.data;

  console.info(
    "[contact]",
    JSON.stringify({ receivedAt: new Date().toISOString(), name, email, message })
  );

  const delivery = await sendGigNotification({
    subject: `Contact form — ${name}`,
    body: [`From: ${name} <${email}>`, "", message].join("\n"),
    replyTo: email
  });

  return {
    status: "success",
    message: delivery.delivered
      ? "Thanks — your message is on its way. We'll reply to the email you gave us."
      : "Thanks — we've received your message.",
    delivered: delivery.delivered
  };
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

  return {
    status: "success",
    message: "Profile received. We'll review it and get in touch before it goes live.",
    delivered: delivery.delivered
  };
}

export async function submitListingAction(formData: FormData) {
  submitListingSchema.parse({
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
export async function submitGigRequestAction(input: GigRequestInput) {
  const payload = gigRequestSchema.parse(input);

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

  const delivery = await sendGigNotification({
    subject: `Musician request — ${payload.organization} (${payload.eventDate})`,
    body: summary,
    replyTo: payload.contactEmail
  });

  return {
    ok: true as const,
    quote,
    summary,
    delivered: delivery.delivered
  };
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
