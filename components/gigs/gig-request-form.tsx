"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { submitGigRequestAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DEFAULT_BROKER_PCT,
  FLOOR_RATE,
  RATE_TIERS,
  computeQuote,
  formatCurrency,
  formatRate
} from "@/lib/rates";

const CONTACT_EMAIL = "hello@centralilmusicministry.com";

const INSTRUMENTS = [
  "Vocals",
  "Piano",
  "Keys",
  "Acoustic Guitar",
  "Electric Guitar",
  "Bass",
  "Drums",
  "Violin",
  "Strings",
  "Choir Direction",
  "Music Direction"
];

const EVENT_TYPES = [
  "Sunday service",
  "Wedding",
  "Funeral or memorial",
  "Holiday service",
  "Conference or retreat",
  "Community event",
  "Rehearsal only"
];

const STEPS = ["Your event", "What you need", "Review"];

type FormState = {
  organization: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  venue: string;
  instruments: string[];
  hours: number;
  musicians: number;
  hourlyRate: number;
  travelMiles: number;
  equipmentFee: number;
  notes: string;
};

const INITIAL: FormState = {
  organization: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  eventType: EVENT_TYPES[0],
  eventDate: "",
  startTime: "",
  venue: "",
  instruments: [],
  hours: 2,
  musicians: 1,
  hourlyRate: RATE_TIERS[0].rate,
  travelMiles: 0,
  equipmentFee: 0,
  notes: ""
};

export function GigRequestForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  /** False when no mail provider is configured — we then ask the user to send a copy. */
  const [delivered, setDelivered] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const quote = useMemo(
    () =>
      computeQuote({
        hourlyRate: form.hourlyRate,
        hours: form.hours,
        musicians: form.musicians,
        travelMiles: form.travelMiles,
        equipmentFee: form.equipmentFee
      }),
    [form]
  );

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleInstrument(name: string) {
    setForm((current) => ({
      ...current,
      instruments: current.instruments.includes(name)
        ? current.instruments.filter((item) => item !== name)
        : [...current.instruments, name]
    }));
  }

  const stepOneComplete =
    form.organization.trim().length > 1 &&
    form.contactName.trim().length > 1 &&
    /.+@.+\..+/.test(form.contactEmail) &&
    form.eventDate !== "" &&
    form.venue.trim().length > 1;

  const stepTwoComplete = form.instruments.length > 0;

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const result = await submitGigRequestAction(form);
      setDelivered(result.delivered);
      setSent(true);
    } catch {
      setError(
        "That didn't go through. You can still send the request by email using the button below."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const emailBody = encodeURIComponent(
    [
      `Organization: ${form.organization}`,
      `Contact: ${form.contactName} (${form.contactEmail}${form.contactPhone ? `, ${form.contactPhone}` : ""})`,
      `Event: ${form.eventType} on ${form.eventDate}${form.startTime ? ` at ${form.startTime}` : ""}`,
      `Venue: ${form.venue}`,
      `Needed: ${form.instruments.join(", ") || "—"}`,
      `${form.musicians} musician(s) for ${form.hours} hour(s) at ${formatRate(form.hourlyRate)}`,
      form.notes ? `Notes: ${form.notes}` : "",
      "",
      `Estimated total: ${formatCurrency(quote.orgTotal)}`
    ]
      .filter(Boolean)
      .join("\n")
  );
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Musician request — ${form.organization || "New request"}`
  )}&body=${emailBody}`;

  if (sent) {
    return (
      <div className="mx-auto max-w-xl rounded-lg border border-line bg-surface p-8 text-center sm:p-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-white">
          <Check className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="mt-6 text-display-md font-semibold text-ink">Request received</h2>
        <p className="mt-3 text-body text-ink-muted">
          We have your details for {form.eventType.toLowerCase()}
          {form.eventDate ? ` on ${formatEventDate(form.eventDate)}` : ""}. Someone will confirm
          availability and the final cost before any musician is booked.
        </p>
        <p className="mt-4 text-body font-semibold text-ink">
          Estimated total: {formatCurrency(quote.orgTotal)}
        </p>
        {delivered ? (
          <div className="mt-8 flex flex-col items-center gap-3">
            <Button asChild>
              <Link href="/musicians">Browse musicians</Link>
            </Button>
            <a href={mailto} className="text-body text-brand-700 underline">
              Also send a copy by email
            </a>
          </div>
        ) : (
          <div className="mt-8">
            <div className="rounded-md border border-line bg-pearl p-4 text-left">
              <p className="text-sm leading-relaxed text-ink-muted">
                To make sure this reaches us quickly, please also send it by email — it opens
                pre-filled, so you only need to press send.
              </p>
            </div>
            <div className="mt-5 flex flex-col items-center gap-3">
              <Button asChild>
                <a href={mailto}>Send a copy by email</a>
              </Button>
              <Link href="/musicians" className="text-body text-brand-700 underline">
                Browse musicians
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
      <div>
        <Stepper step={step} />

        <div className="mt-8 rounded-lg border border-line bg-surface p-6 sm:p-8">
          {step === 0 && (
            <section className="space-y-6">
              <h2 className="text-display-md font-semibold text-ink">Tell us about your event</h2>

              <Field label="Church or organization" required>
                <Input
                  value={form.organization}
                  onChange={(event) => set("organization", event.target.value)}
                  placeholder="Hope Fellowship Savoy"
                  autoComplete="organization"
                />
              </Field>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Your name" required>
                  <Input
                    value={form.contactName}
                    onChange={(event) => set("contactName", event.target.value)}
                    autoComplete="name"
                  />
                </Field>
                <Field label="Email" required>
                  <Input
                    type="email"
                    value={form.contactEmail}
                    onChange={(event) => set("contactEmail", event.target.value)}
                    autoComplete="email"
                  />
                </Field>
                <Field label="Phone" hint="Optional, but speeds up scheduling.">
                  <Input
                    type="tel"
                    value={form.contactPhone}
                    onChange={(event) => set("contactPhone", event.target.value)}
                    autoComplete="tel"
                  />
                </Field>
                <Field label="Type of event">
                  <select
                    value={form.eventType}
                    onChange={(event) => set("eventType", event.target.value)}
                    className="focus-ring h-11 w-full rounded-md border border-line bg-surface px-4 text-body text-ink"
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Date" required>
                  <Input
                    type="date"
                    value={form.eventDate}
                    onChange={(event) => set("eventDate", event.target.value)}
                  />
                </Field>
                <Field label="Start time">
                  <Input
                    type="time"
                    value={form.startTime}
                    onChange={(event) => set("startTime", event.target.value)}
                  />
                </Field>
              </div>

              <Field label="Venue or address" required>
                <Input
                  value={form.venue}
                  onChange={(event) => set("venue", event.target.value)}
                  placeholder="Main sanctuary, 100 W Green St, Champaign"
                />
              </Field>
            </section>
          )}

          {step === 1 && (
            <section className="space-y-8">
              <h2 className="text-display-md font-semibold text-ink">What do you need?</h2>

              <fieldset>
                <legend className="text-sm font-semibold text-ink">
                  Instruments and roles <span className="text-ink-subtle">(pick at least one)</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {INSTRUMENTS.map((name) => {
                    const selected = form.instruments.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleInstrument(name)}
                        aria-pressed={selected}
                        className={`press focus-ring rounded-full border px-4 py-2 text-sm ${
                          selected
                            ? "border-2 border-brand-500 text-ink"
                            : "border-line text-ink-muted"
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-semibold text-ink">Experience level</legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {RATE_TIERS.map((tier) => {
                    const selected = form.hourlyRate === tier.rate;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => set("hourlyRate", tier.rate)}
                        aria-pressed={selected}
                        className={`press focus-ring rounded-md border p-4 text-left ${
                          selected ? "border-2 border-brand-500" : "border-line"
                        }`}
                      >
                        <span className="block text-sm font-semibold text-ink">{tier.label}</span>
                        <span className="mt-1 block text-body font-semibold text-ink">
                          {formatRate(tier.rate)}
                        </span>
                        <span className="mt-2 block text-sm leading-snug text-ink-subtle">
                          {tier.blurb}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="space-y-6">
                <Slider
                  label="How many musicians?"
                  min={1}
                  max={10}
                  step={1}
                  value={form.musicians}
                  onChange={(value) => set("musicians", value)}
                  display={`${form.musicians}`}
                />
                <Slider
                  label="How long?"
                  hint="Include sound check and rehearsal."
                  min={1}
                  max={8}
                  step={0.5}
                  value={form.hours}
                  onChange={(value) => set("hours", value)}
                  display={`${form.hours} ${form.hours === 1 ? "hour" : "hours"}`}
                />
                <Slider
                  label="Round-trip travel"
                  min={0}
                  max={120}
                  step={5}
                  value={form.travelMiles}
                  onChange={(value) => set("travelMiles", value)}
                  display={form.travelMiles === 0 ? "None" : `${form.travelMiles} miles`}
                />
                <Slider
                  label="Equipment or setup"
                  hint="Backline, PA rental, piano tuning."
                  min={0}
                  max={500}
                  step={25}
                  value={form.equipmentFee}
                  onChange={(value) => set("equipmentFee", value)}
                  display={form.equipmentFee === 0 ? "None" : formatCurrency(form.equipmentFee)}
                />
              </div>

              <Field label="Anything else we should know?">
                <textarea
                  value={form.notes}
                  onChange={(event) => set("notes", event.target.value)}
                  rows={4}
                  placeholder="Song list, worship style, parking notes, who to ask for on arrival…"
                  className="focus-ring w-full rounded-md border border-line bg-surface p-4 text-body text-ink placeholder:text-ink-subtle"
                />
              </Field>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-6">
              <h2 className="text-display-md font-semibold text-ink">Check it over</h2>

              <dl className="divide-y divide-line-soft">
                <Row label="Organization" value={form.organization} />
                <Row label="Contact" value={`${form.contactName} · ${form.contactEmail}`} />
                {form.contactPhone && <Row label="Phone" value={form.contactPhone} />}
                <Row
                  label="Event"
                  value={`${form.eventType} · ${form.eventDate}${form.startTime ? ` at ${form.startTime}` : ""}`}
                />
                <Row label="Venue" value={form.venue} />
                <Row label="Needed" value={form.instruments.join(", ")} />
                <Row
                  label="Booking"
                  value={`${form.musicians} musician${form.musicians === 1 ? "" : "s"} · ${form.hours} hour${form.hours === 1 ? "" : "s"} · ${formatRate(form.hourlyRate)}`}
                />
                {form.notes && <Row label="Notes" value={form.notes} />}
              </dl>

              <p className="text-sm leading-relaxed text-ink-subtle">
                Sending this doesn&apos;t book anyone or charge anything. We confirm availability and
                the final cost with you first.
              </p>

              {error && (
                <p role="alert" className="text-sm text-ink">
                  {error}{" "}
                  <a href={mailto} className="text-brand-700 underline">
                    Email the request
                  </a>
                </p>
              )}
            </section>
          )}

          {/* ── Step controls ─────────────────────────────────── */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-line-soft pt-6">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
              className="press focus-ring rounded-full px-2 py-2 text-body text-brand-700 disabled:text-ink-subtle"
            >
              Back
            </button>

            {step < 2 ? (
              <Button
                type="button"
                onClick={() => setStep((current) => current + 1)}
                disabled={step === 0 ? !stepOneComplete : !stepTwoComplete}
              >
                Continue
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Sending…" : "Send request"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Running estimate ───────────────────────────────────── */}
      <aside className="rounded-lg bg-tile p-6 text-white lg:sticky lg:top-32">
        <p className="text-sm text-white/60">Running estimate</p>
        <p className="mt-1 text-display-lg font-semibold" aria-live="polite">
          {formatCurrency(quote.orgTotal)}
        </p>
        <dl className="mt-6 space-y-3 border-t border-white/15 pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-white/60">Musician pay</dt>
            <dd>{formatCurrency(quote.musicianPayout)}</dd>
          </div>
          {quote.travelTotal > 0 && (
            <div className="flex justify-between">
              <dt className="text-white/60">Travel</dt>
              <dd>{formatCurrency(quote.travelTotal)}</dd>
            </div>
          )}
          {quote.equipmentFee > 0 && (
            <div className="flex justify-between">
              <dt className="text-white/60">Equipment</dt>
              <dd>{formatCurrency(quote.equipmentFee)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-white/60">Coordination ({DEFAULT_BROKER_PCT}%)</dt>
            <dd>{formatCurrency(quote.brokerFee)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          Musicians on this directory are never booked below {formatCurrency(FLOOR_RATE)} an hour.
        </p>
      </aside>
    </div>
  );
}

/** "Sunday, September 13, 2026" — parsed as local time so the date can't slip a day. */
function formatEventDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
      {STEPS.map((label, index) => {
        const done = index < step;
        const current = index === step;
        return (
          <li key={label} className="flex items-center gap-3">
            <span
              aria-current={current ? "step" : undefined}
              className={`flex items-center gap-2 ${current ? "text-ink" : "text-ink-subtle"}`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                  current || done ? "bg-brand-700 text-white" : "bg-line-soft text-ink-subtle"
                }`}
              >
                {done ? <Check className="h-3 w-3" aria-hidden="true" /> : index + 1}
              </span>
              {label}
            </span>
            {index < STEPS.length - 1 && (
              <span aria-hidden="true" className="h-px w-6 bg-line" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Field({
  label,
  hint,
  required,
  children
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">
        {label}
        {required && <span className="text-ink-subtle"> *</span>}
      </span>
      {hint && <span className="mt-0.5 block text-sm text-ink-subtle">{hint}</span>}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap justify-between gap-4 py-3">
      <dt className="text-sm text-ink-subtle">{label}</dt>
      <dd className="text-body text-ink">{value}</dd>
    </div>
  );
}

function Slider({
  label,
  hint,
  min,
  max,
  step,
  value,
  onChange,
  display
}: {
  label: string;
  hint?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  display: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={`gig-${label}`} className="text-sm font-semibold text-ink">
          {label}
        </label>
        <span className="text-body font-semibold text-ink">{display}</span>
      </div>
      {hint && <p className="mt-1 text-sm text-ink-subtle">{hint}</p>}
      <input
        id={`gig-${label}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number.parseFloat(event.target.value))}
        className="mt-3 w-full"
      />
    </div>
  );
}
