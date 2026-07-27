/**
 * Verifies email notification setup end to end.
 *
 *   npm run check:email
 *
 * Reads .env.local (then .env), reports what is configured, and sends one real
 * test message. Prints the specific reason on failure rather than a generic
 * error, because every failure here has a different fix.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

loadEnvFile(".env.local");
loadEnvFile(".env");

function loadEnvFile(name: string) {
  const path = resolve(process.cwd(), name);
  if (!existsSync(path)) return;

  for (const rawLine of readFileSync(path, "utf8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    // Real environment variables win over file values.
    if (value && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

async function main() {
  const { notificationConfigStatus, sendGigNotification } = await import("../lib/notify");
  const status = notificationConfigStatus();

  console.log("\nEmail notification setup\n" + "-".repeat(40));
  console.log(`API key present   ${status.hasApiKey ? `yes (${status.apiKeyLength} chars)` : "NO"}`);
  console.log(`Sends to          ${status.recipient ?? "NOT SET"}`);
  console.log(`Sends from        ${status.from}${status.usingSandboxSender ? "  (sandbox)" : ""}`);

  if (status.usingSandboxSender) {
    console.log(
      "\nNote: the sandbox sender only delivers to the email address that owns\n" +
        "your Resend account. Set GIG_NOTIFICATION_FROM to an address on a domain\n" +
        "you have verified with Resend to send anywhere."
    );
  }

  if (!status.hasApiKey) {
    console.log("\nRESEND_API_KEY is not set, so nothing can send yet.");
    console.log("Add it to .env.local for local testing, and to Vercel for production.");
    process.exit(1);
  }

  if (!status.recipient) {
    console.log("\nNo recipient. Set GIG_NOTIFICATION_EMAIL (or ADMIN_EMAIL).");
    process.exit(1);
  }

  console.log("\nSending a test message…");

  const result = await sendGigNotification({
    subject: "Test — Central Illinois Musicians notifications",
    body: [
      "This is a test from your musician directory.",
      "",
      "If you are reading this, gig requests, musician profile submissions,",
      "and contact form messages will now reach this inbox.",
      "",
      `Sent ${new Date().toLocaleString("en-US")}`
    ].join("\n")
  });

  if (result.delivered) {
    console.log(`\n✓ Sent. Check ${status.recipient} (including spam) within a minute.\n`);
    process.exit(0);
  }

  console.log(`\n✗ Not delivered — ${result.reason}`);
  if (result.detail) console.log(`  ${result.detail}`);

  const hints: Record<string, string> = {
    rejected:
      "Resend refused it. Usual causes: the API key is wrong or revoked, or\n" +
      "  GIG_NOTIFICATION_FROM uses a domain you have not verified.",
    unreachable: "Could not reach Resend at all. Check your internet connection.",
    not_configured: "RESEND_API_KEY is missing.",
    no_recipient: "GIG_NOTIFICATION_EMAIL is missing."
  };
  if (hints[result.reason]) console.log(`  ${hints[result.reason]}`);
  console.log();
  process.exit(1);
}

main().catch((error) => {
  console.error("\nUnexpected failure:", error);
  process.exit(1);
});
