"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AUDIENCES,
  BILLING_LIVE,
  type Audience,
  type Plan,
  annualSavings,
  getPlan,
  isFree,
  monthlyEquivalent,
  plansFor,
  resolvedFeatures
} from "@/lib/plans";

type Billing = "monthly" | "annual";

function money(value: number) {
  return value % 1 === 0 ? `$${value}` : `$${value.toFixed(2)}`;
}

export function PricingPlans() {
  const [audience, setAudience] = useState<Audience>("musician");
  const [billing, setBilling] = useState<Billing>("monthly");

  const plans = plansFor(audience);
  const active = AUDIENCES.find((item) => item.id === audience)!;

  return (
    <div>
      {/* ── Audience switch ──────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4">
        <div
          role="tablist"
          aria-label="Who are you?"
          className="flex flex-wrap justify-center gap-2 rounded-full bg-pearl p-1 ring-1 ring-line"
        >
          {AUDIENCES.map((item) => {
            const selected = audience === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={selected}
                onClick={() => setAudience(item.id)}
                className={`press focus-ring rounded-full px-5 py-2 text-sm transition-colors ${
                  selected ? "bg-brand-700 text-white" : "text-ink-muted hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-ink-subtle">{active.blurb}</p>
      </div>

      {/* ── Billing period ───────────────────────────────────────────── */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <div
          role="radiogroup"
          aria-label="Billing period"
          className="inline-flex rounded-full bg-pearl p-1 ring-1 ring-line"
        >
          {(["monthly", "annual"] as const).map((period) => {
            const selected = billing === period;
            return (
              <button
                key={period}
                role="radio"
                aria-checked={selected}
                onClick={() => setBilling(period)}
                className={`press focus-ring rounded-full px-5 py-2 text-sm capitalize transition-colors ${
                  selected ? "bg-surface text-ink ring-1 ring-line" : "text-ink-muted"
                }`}
              >
                {period}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-ink-subtle">
          {billing === "annual"
            ? "Billed once a year — two months free."
            : "Billed monthly. Switch to annual for two months free."}
        </p>
      </div>

      {/* ── Plan cards ───────────────────────────────────────────────── */}
      {/*
        Column counts are spelled out rather than interpolated — Tailwind scans
        source text, so a class built at runtime is never generated.
      */}
      <div
        className={`mt-12 grid gap-6 ${
          plans.length === 1
            ? "mx-auto max-w-md"
            : plans.length === 2
              ? "lg:grid-cols-2"
              : "lg:grid-cols-3"
        }`}
      >
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} billing={billing} />
        ))}
      </div>

      <ComparisonTable audience={audience} />
    </div>
  );
}

function PlanCard({ plan, billing }: { plan: Plan; billing: Billing }) {
  const free = isFree(plan);
  const parent = plan.inheritsFrom ? getPlan(plan.inheritsFrom) : undefined;
  const savings = annualSavings(plan);

  return (
    <div
      className={`flex flex-col rounded-lg border bg-surface p-6 sm:p-8 ${
        plan.highlighted ? "border-2 border-brand-500" : "border-line"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-tagline font-semibold text-ink">{plan.name}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-subtle">{plan.bestFor}</p>
        </div>
        {plan.highlighted && (
          <span className="shrink-0 rounded-full bg-brand-700 px-3 py-1 text-xs font-semibold text-white">
            Popular
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mt-6">
        {free ? (
          <p className="text-display-md font-semibold text-ink">Free</p>
        ) : (
          <>
            <p className="text-display-md font-semibold text-ink">
              {money(billing === "annual" ? monthlyEquivalent(plan) : plan.monthly)}
              <span className="text-body font-normal text-ink-subtle"> /month</span>
            </p>
            <p className="mt-1 text-sm text-ink-subtle">
              {billing === "annual"
                ? `${money(plan.annual)} billed yearly — save ${money(savings)}`
                : "Billed monthly"}
            </p>
          </>
        )}
      </div>

      {/* Call to action */}
      <div className="mt-6">
        {free ? (
          <Button asChild className="w-full">
            <Link href={plan.audience === "church" ? "/request-musician" : "/create-profile"}>
              Get started free
            </Link>
          </Button>
        ) : BILLING_LIVE ? (
          <Button asChild className="w-full">
            <Link href={`/checkout?plan=${plan.id}&billing=${billing}`}>
              {plan.trialDays > 0 ? `Start ${plan.trialDays}-day free trial` : "Choose this plan"}
            </Link>
          </Button>
        ) : (
          /*
            Billing is not connected. Rather than a button that cannot complete
            a purchase, this registers interest and says so plainly.
          */
          <>
            <Button asChild variant="secondary" className="w-full">
              <Link href={`/contact?interest=${plan.id}`}>Tell me when this launches</Link>
            </Button>
            <p className="mt-2 text-center text-xs text-ink-subtle">
              Memberships aren&apos;t open yet. Nothing is charged.
            </p>
          </>
        )}
      </div>

      {/* Features */}
      <div className="mt-8 flex-1">
        {parent && (
          <p className="mb-3 text-sm font-semibold text-ink">
            Everything in {parent.name}, plus:
          </p>
        )}
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-ink-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {plan.caveat && (
        <p className="mt-6 border-t border-line-soft pt-4 text-xs leading-relaxed text-ink-subtle">
          {plan.caveat}
        </p>
      )}
    </div>
  );
}

/**
 * Full matrix of resolved features, so a reader can see exactly what each tier
 * includes without decoding "everything in the previous plan".
 */
function ComparisonTable({ audience }: { audience: Audience }) {
  const plans = plansFor(audience);

  // Union of every feature across the tiers, in the order they first appear.
  const rows: string[] = [];
  for (const plan of plans) {
    for (const feature of resolvedFeatures(plan)) {
      if (!rows.includes(feature)) rows.push(feature);
    }
  }

  const granted = plans.map((plan) => new Set(resolvedFeatures(plan)));

  return (
    <div className="mt-16">
      <h3 className="text-display-md font-semibold text-ink">Compare every feature</h3>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">
            Feature comparison across {audience} plans
          </caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="py-3 pr-4 text-sm font-semibold text-ink">
                Feature
              </th>
              {plans.map((plan) => (
                <th
                  key={plan.id}
                  scope="col"
                  className="w-32 py-3 text-center text-sm font-semibold text-ink"
                >
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((feature) => (
              <tr key={feature} className="border-b border-line-soft">
                <th
                  scope="row"
                  className="py-3 pr-4 text-sm font-normal leading-relaxed text-ink-muted"
                >
                  {feature}
                </th>
                {plans.map((plan, index) => (
                  <td key={plan.id} className="py-3 text-center">
                    {granted[index].has(feature) ? (
                      <>
                        <Check
                          className="mx-auto h-4 w-4 text-brand-700"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Included in {plan.name}</span>
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true" className="text-ink-subtle">
                          —
                        </span>
                        <span className="sr-only">Not included in {plan.name}</span>
                      </>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
