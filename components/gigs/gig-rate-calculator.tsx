"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_BROKER_PCT,
  FLOOR_RATE,
  MILEAGE_RATE,
  RATE_TIERS,
  computeQuote,
  formatCurrency,
  formatRate,
  quoteToPlainText
} from "@/lib/rates";

type Props = {
  /** Preset the rate from a specific musician's profile. */
  initialRate?: number;
  musicianName?: string;
};

export function GigRateCalculator({ initialRate, musicianName }: Props) {
  const [tierId, setTierId] = useState(() => {
    if (!initialRate) return RATE_TIERS[0].id;
    return RATE_TIERS.find((tier) => tier.rate === initialRate)?.id ?? "custom";
  });
  const [customRate, setCustomRate] = useState(initialRate ?? FLOOR_RATE);
  const [hours, setHours] = useState(2);
  const [musicians, setMusicians] = useState(1);
  const [travelMiles, setTravelMiles] = useState(0);
  const [equipmentFee, setEquipmentFee] = useState(0);
  const [copied, setCopied] = useState(false);

  const hourlyRate =
    tierId === "custom" ? customRate : RATE_TIERS.find((tier) => tier.id === tierId)!.rate;

  const quote = useMemo(
    () => computeQuote({ hourlyRate, hours, musicians, travelMiles, equipmentFee }),
    [hourlyRate, hours, musicians, travelMiles, equipmentFee]
  );

  async function copyQuote() {
    await navigator.clipboard.writeText(quoteToPlainText(quote));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
      {/* ── Inputs ─────────────────────────────────────────────── */}
      <div className="space-y-8 rounded-lg border border-line bg-surface p-6 sm:p-8">
        <fieldset>
          <legend className="text-sm font-semibold text-ink">
            {musicianName ? `Rate for ${musicianName}` : "What kind of musician?"}
          </legend>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {RATE_TIERS.map((tier) => {
              const selected = tierId === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setTierId(tier.id)}
                  aria-pressed={selected}
                  className={`press focus-ring rounded-md border p-4 text-left ${
                    selected ? "border-2 border-brand-500 bg-surface" : "border-line bg-surface"
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

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setTierId("custom")}
              aria-pressed={tierId === "custom"}
              className={`press focus-ring rounded-full border px-4 py-2 text-sm ${
                tierId === "custom" ? "border-2 border-brand-500 text-ink" : "border-line text-ink-muted"
              }`}
            >
              Set a specific rate
            </button>

            {tierId === "custom" && (
              <label className="flex items-center gap-2 text-sm text-ink-muted">
                <span>Hourly rate</span>
                <span className="flex items-center gap-1 rounded-md border border-line px-3 py-2">
                  <span aria-hidden="true">$</span>
                  <input
                    type="number"
                    min={FLOOR_RATE}
                    step={5}
                    value={customRate}
                    aria-label="Custom hourly rate in dollars"
                    onChange={(event) =>
                      setCustomRate(Number.parseFloat(event.target.value) || FLOOR_RATE)
                    }
                    onBlur={() => setCustomRate((rate) => Math.max(FLOOR_RATE, rate))}
                    className="w-20 bg-transparent text-body text-ink focus:outline-none"
                  />
                </span>
              </label>
            )}
          </div>

          {tierId === "custom" && customRate < FLOOR_RATE && (
            <p role="status" className="mt-2 text-sm text-ink-muted">
              Musicians on this directory are never booked below {formatCurrency(FLOOR_RATE)} an
              hour. This quote uses the {formatCurrency(FLOOR_RATE)} minimum.
            </p>
          )}
        </fieldset>

        <hr className="border-line-soft" />

        <div className="space-y-6">
          <SliderRow
            label="How long is the event?"
            hint="Includes sound check and rehearsal time."
            min={1}
            max={8}
            step={0.5}
            value={hours}
            onChange={setHours}
            display={`${hours} ${hours === 1 ? "hour" : "hours"}`}
          />
          <SliderRow
            label="How many musicians?"
            min={1}
            max={10}
            step={1}
            value={musicians}
            onChange={setMusicians}
            display={`${musicians} ${musicians === 1 ? "musician" : "musicians"}`}
          />
          <SliderRow
            label="Round-trip travel"
            hint={`Reimbursed at ${MILEAGE_RATE.toFixed(2)} per mile, per musician.`}
            min={0}
            max={120}
            step={5}
            value={travelMiles}
            onChange={setTravelMiles}
            display={travelMiles === 0 ? "None" : `${travelMiles} miles`}
          />
          <SliderRow
            label="Equipment or setup"
            hint="Backline, PA rental, or a piano tuning."
            min={0}
            max={500}
            step={25}
            value={equipmentFee}
            onChange={setEquipmentFee}
            display={equipmentFee === 0 ? "None" : formatCurrency(equipmentFee)}
          />
        </div>
      </div>

      {/* ── Running quote ──────────────────────────────────────── */}
      <div className="rounded-lg bg-tile p-6 text-white lg:sticky lg:top-32">
        <p className="text-sm text-white/60">Estimated total</p>
        <p className="mt-1 text-display-lg font-semibold" aria-live="polite">
          {formatCurrency(quote.orgTotal)}
        </p>
        <p className="mt-2 text-sm text-white/60">
          {formatRate(quote.hourlyRate)} × {quote.hours}h × {quote.musicians}{" "}
          {quote.musicians === 1 ? "musician" : "musicians"}
        </p>

        <dl className="mt-6 space-y-3 border-t border-white/15 pt-6 text-sm">
          <Line label="Musician pay" value={formatCurrency(quote.musicianPayout)} />
          {quote.travelTotal > 0 && (
            <Line label="Travel" value={formatCurrency(quote.travelTotal)} />
          )}
          {quote.equipmentFee > 0 && (
            <Line label="Equipment" value={formatCurrency(quote.equipmentFee)} />
          )}
          <Line
            label={`Coordination (${DEFAULT_BROKER_PCT}%)`}
            value={formatCurrency(quote.brokerFee)}
          />
          <div className="flex justify-between border-t border-white/15 pt-3 font-semibold">
            <dt>Total</dt>
            <dd>{formatCurrency(quote.orgTotal)}</dd>
          </div>
        </dl>

        <p className="mt-4 text-sm leading-relaxed text-white/60">
          Each musician takes home {formatCurrency(quote.perMusician)}.
          {quote.atFloor && " This is the published minimum rate."}
        </p>

        <div className="mt-6 space-y-2">
          <Button asChild className="w-full">
            <Link href="/request-musician">Start a request</Link>
          </Button>
          <button
            type="button"
            onClick={copyQuote}
            className="press focus-ring w-full rounded-full border border-white/25 py-[11px] text-body text-white"
          >
            {copied ? "Copied" : "Copy estimate"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-white/60">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function SliderRow({
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
        <label htmlFor={`slider-${label}`} className="text-sm font-semibold text-ink">
          {label}
        </label>
        <span className="text-body font-semibold text-ink">{display}</span>
      </div>
      {hint && <p className="mt-1 text-sm text-ink-subtle">{hint}</p>}
      <input
        id={`slider-${label}`}
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
