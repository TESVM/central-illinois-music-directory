export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <p className="text-sm font-semibold text-brand-700">{eyebrow}</p> : null}
      <h2 className="mt-2 text-display-md font-semibold text-ink">{title}</h2>
      {description ? <p className="mt-4 text-lead font-normal text-ink-muted">{description}</p> : null}
    </div>
  );
}
