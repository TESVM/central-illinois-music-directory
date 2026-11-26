/**
 * Section or page heading.
 *
 * `as` defaults to "h2" because this is also used for genuine sub-sections
 * (the homepage uses it four times below its own h1). Pages that use it as
 * their main title pass `as="h1"` — without it the page has no level-one
 * heading, which costs screen-reader users the page's primary landmark
 * (WCAG 2.2 AA, 1.3.1 Info and Relationships / 2.4.6 Headings and Labels).
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  as: Heading = "h2"
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <p className="text-sm font-semibold text-brand-700">{eyebrow}</p> : null}
      <Heading className="mt-2 text-display-md font-semibold text-ink">{title}</Heading>
      {description ? (
        <p className="mt-4 text-lead font-normal text-ink-muted">{description}</p>
      ) : null}
    </div>
  );
}
