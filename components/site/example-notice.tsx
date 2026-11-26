import Link from "next/link";
import { Info } from "lucide-react";

/*
 * These used to be module-level constants computed from the hardcoded array.
 * Now that musicians come from the database, the count is only knowable at
 * request time, so callers fetch it (lib/data/musicians.ts, getDirectoryCounts)
 * and pass it in.
 */

/**
 * Shown wherever sample listings are visible.
 *
 * The seeded musicians are placeholders with example.com addresses and 555
 * phone numbers. Presenting them without a label would mean a church emailing
 * someone who does not exist.
 */
export function ExampleNotice({
  show,
  className = ""
}: {
  /** True when every published listing is sample data. */
  show: boolean;
  className?: string;
}) {
  if (!show) return null;

  return (
    <div
      role="note"
      className={`flex items-start gap-3 rounded-lg border border-line bg-pearl p-4 ${className}`}
    >
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-ink-subtle" aria-hidden="true" />
      <p className="text-sm leading-relaxed text-ink-muted">
        <span className="font-semibold text-ink">These are example listings.</span> They show how
        profiles will look and are not real people — the contact details are placeholders. If
        you&apos;re a musician,{" "}
        <Link href="/create-profile" className="text-brand-700 underline">
          add your profile
        </Link>
        . If you need musicians for an event,{" "}
        <Link href="/request-musician" className="text-brand-700 underline">
          send a request
        </Link>{" "}
        and we&apos;ll match you personally.
      </p>
    </div>
  );
}

/** Compact inline badge for individual cards and profile headers. */
export function ExampleBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-pearl px-2.5 py-1 text-xs font-semibold text-ink-muted ring-1 ring-line ${className}`}
    >
      Example listing
    </span>
  );
}
