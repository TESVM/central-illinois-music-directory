/**
 * Outbound email for gig requests.
 *
 * Uses the Resend REST API directly — no SDK dependency and nothing to install.
 * If `RESEND_API_KEY` is not configured the send is skipped and the caller is
 * told so, rather than the request silently vanishing. Delivery failure never
 * throws: a request that reached the server must not be lost because an email
 * provider had a bad minute.
 */

export type DeliveryResult =
  | { delivered: true }
  | { delivered: false; reason: "not_configured" | "send_failed" };

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
  const to = process.env.GIG_NOTIFICATION_EMAIL ?? process.env.ADMIN_EMAIL;
  const from = process.env.GIG_NOTIFICATION_FROM;

  if (!apiKey || !to || !from) {
    return { delivered: false, reason: "not_configured" };
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
      console.error("[notify] Resend rejected the send", response.status, await response.text());
      return { delivered: false, reason: "send_failed" };
    }

    return { delivered: true };
  } catch (error) {
    console.error("[notify] Could not reach Resend", error);
    return { delivered: false, reason: "send_failed" };
  }
}
