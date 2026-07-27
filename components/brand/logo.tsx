/**
 * Brand identity.
 *
 * The mark is a four-bar equalizer in a squircle — it reads as "music" at 16px
 * in a browser tab and still holds up at 512px on a share card. Monochrome by
 * design, per DESIGN.md: no gradients, single accent.
 */

export function LogoMark({
  className = "h-8 w-8",
  tone = "ink"
}: {
  className?: string;
  /** `bare` drops the squircle — for use on an already-dark surface. */
  tone?: "ink" | "white" | "brand" | "bare";
}) {
  const plate = tone === "white" ? "#ffffff" : tone === "brand" ? "#0066cc" : "#1d1d1f";
  const bars = tone === "white" ? "#1d1d1f" : "#ffffff";

  return (
    <svg viewBox="0 0 64 64" role="img" aria-label="Central Illinois Musicians" className={className}>
      {tone !== "bare" && <rect x="0" y="0" width="64" height="64" rx="15" fill={plate} />}
      {/* Four bars at staggered heights — a level meter mid-signal. */}
      <rect x="15" y="26" width="6" height="12" rx="3" fill={bars} />
      <rect x="26" y="18" width="6" height="28" rx="3" fill={bars} />
      <rect x="37" y="23" width="6" height="18" rx="3" fill={bars} />
      <rect x="48" y="29" width="6" height="6" rx="3" fill={bars} />
    </svg>
  );
}

export function Wordmark({
  className = "",
  tone = "ink"
}: {
  className?: string;
  tone?: "ink" | "white";
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-7 w-7" tone={tone === "white" ? "white" : "ink"} />
      <span className={`text-tagline font-semibold ${tone === "white" ? "text-white" : "text-ink"}`}>
        Central Illinois Musicians
      </span>
    </span>
  );
}
