import "server-only";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma/client";
import { hasDatabase } from "@/lib/data/musicians";

/**
 * Durable storage for everything the public forms collect.
 *
 * The order matters: a submission is **saved before** the notification email
 * is attempted. Previously the email was the only record, so a provider
 * outage lost the lead outright. Now a failed send is a retry problem, not a
 * lost enquiry, and `notification` tracks that separately from receipt.
 *
 * Without `DATABASE_URL` these are no-ops that report `stored: false`, so the
 * callers keep their pre-database behaviour (succeed only if the mail was
 * accepted) rather than claiming a receipt nothing can back up.
 */

export type SubmissionKind =
  | "CONTACT"
  | "MUSICIAN_PROFILE"
  | "CHURCH_LISTING"
  | "GIG_REQUEST";

export type RecordedSubmission =
  | { stored: true; id: string; duplicate: boolean }
  | { stored: false; reason: "no_database" | "write_failed" };

/**
 * Stable identity for a submission.
 *
 * A double-click, or a retry after a failed notification, produces the same
 * key and updates the existing row rather than creating a second lead. The
 * date is included so the same person legitimately sending the same enquiry
 * next week is treated as new.
 */
function buildDedupeKey(kind: SubmissionKind, contactEmail: string, payload: unknown): string {
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256")
    .update([kind, contactEmail.toLowerCase().trim(), day, JSON.stringify(payload)].join("|"))
    .digest("hex")
    .slice(0, 40);
}

export async function recordSubmission(input: {
  kind: SubmissionKind;
  contactName: string;
  contactEmail: string;
  organization?: string;
  payload: Record<string, unknown>;
  summary: string;
}): Promise<RecordedSubmission> {
  if (!hasDatabase()) return { stored: false, reason: "no_database" };

  const dedupeKey = buildDedupeKey(input.kind, input.contactEmail, input.payload);

  try {
    const existing = await prisma.formSubmission.findUnique({
      where: { dedupeKey },
      select: { id: true }
    });

    const row = await prisma.formSubmission.upsert({
      where: { dedupeKey },
      create: {
        kind: input.kind,
        dedupeKey,
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        organization: input.organization,
        payload: input.payload as never,
        summary: input.summary
      },
      // A repeat of the same submission refreshes the content but must not
      // reset triage — a staff member may already be working on it.
      update: {
        payload: input.payload as never,
        summary: input.summary,
        contactName: input.contactName,
        organization: input.organization
      },
      select: { id: true }
    });

    return { stored: true, id: row.id, duplicate: existing !== null };
  } catch (error) {
    console.error("[submissions] write failed", error);
    return { stored: false, reason: "write_failed" };
  }
}

/** Records the outcome of a delivery attempt against a stored submission. */
export async function recordNotificationResult(
  submissionId: string,
  result: { delivered: boolean; detail?: string }
): Promise<void> {
  if (!hasDatabase()) return;

  try {
    await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        notification: result.delivered ? "SENT" : "FAILED",
        notifiedAt: result.delivered ? new Date() : null,
        notificationError: result.delivered ? null : (result.detail ?? "delivery failed").slice(0, 500),
        notifyAttempts: { increment: 1 }
      }
    });
  } catch (error) {
    // The submission is already safe; losing the delivery marker is survivable.
    console.error("[submissions] could not record notification result", error);
  }
}
