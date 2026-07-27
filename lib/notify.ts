/**
 * Outbound email for gig requests, profile submissions, and contact messages.
 *
 * Uses the Resend REST API directly — no SDK dependency and nothing to install.
 * Delivery failure never throws: a submission that reached the server must not
 * be lost because an email provider had a bad minute. The caller is told
 * whether delivery happened so the UI can be honest about it.
 */

/**
 * Resend's shared sandbox sender. It works with no domain verification, but it
 * will ONLY deliver to the email address that owns the Resend account. Good
 * enough to go live today; swap in your own domain when you have one.
 */
const SANDBOX_FROM = "Central Illinois Musicians <onboarding@resend.dev>";

export type DeliveryReason = "not_configured" | "no_recipient" | "rejected" | "unreachable";

export type DeliveryResult =
  | { delivered: true }
  | { delivered: false; reason: DeliveryReason; detail?: string };

/** Where notifications land. */
export function notificationRecipient(): string | undefined {
  return process.env.GIG_NOTIFICATION_EMAIL ?? process.env.ADMIN_EMAIL;
}

/** Reports what is and isn't configured, without exposing the key itself. */
export function notificationConfigStatus() {
  const apiKey = process.env.RESEND_API_KEY;
  return {
    hasApiKey: Boolean(apiKey),
    // Never log or return the key. Length alone is enough to spot a paste error.
    apiKeyLength: apiKey?.length ?? 0,
    recipient: notificationRecipient(),
    from: process.env.GIG_NOTIFICATION_FROM ?? SANDBOX_FROM,
    usingSandboxSender: !process.env.GIG_NOTIFICATION_FROM
  };
}

export async function sendGigNotification({
  subject,
  body,
  replyTo
}: {
  subject: string;
  body: string;
  replyTo?: string;
}): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = notificationRecipient();

  // Falls back to the sandbox sender so a missing GIG_NOTIFICATION_FROM is not
  // by itself a reason for mail to stop working.
  const from = process.env.GIG_NOTIFICATION_FROM ?? SANDBOX_FROM;

  if (!apiKey) {
    return { delivered: false, reason: "not_configured" };
  }
  if (!to) {
    return { delivered: false, reason: "no_recipient" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text: body,
        ...(replyTo ? { reply_to: replyTo } : {})
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("[notify] Resend rejected the send", response.status, detail);
      return { delivered: false, reason: "rejected", detail };
    }

    return { delivered: true };
  } catch (error) {
    console.error("[notify] Could not reach Resend", error);
    return {
      delivered: false,
      reason: "unreachable",
      detail: error instanceof Error ? error.message : String(error)
    };
  }
}
