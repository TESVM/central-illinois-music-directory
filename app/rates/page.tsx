import type { Metadata } from "next";
import Link from "next/link";
import { GigRateCalculator } from "@/components/gigs/gig-rate-calculator";
import { TrustStrip } from "@/components/site/trust-strip";
import { Button } from "@/components/ui/button";
import { DEFAULT_BROKER_PCT, FLOOR_RATE, MILEAGE_RATE, formatCurrency } from "@/lib/rates";

export const metadata: Metadata = {
  title: "Rates & pricing",
  description:
    "What it costs to book a musician in Central Illinois. Every booking starts at $35 an hour, with a transparent breakdown of travel, equipment, and coordination."
};

export default function RatesPage() {
  return (
    <>
      {/* Hero tile — light. */}
      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
          <h1 className="text-display-lg font-semibold text-ink sm:text-hero">
            Musicians start at {formatCurrency(FLOOR_RATE)} an hour.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lead font-normal text-ink-muted">
            No hidden fees, no negotiating people down. See exactly what your event costs before you
            talk to anyone.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/request-musician">Request a musician</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/musicians">Browse musicians</Link>
            </Button>
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* Calculator tile — parchment. */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-[1100px] px-4 py-20 sm:px-6">
          <h2 className="text-display-md font-semibold text-ink">Estimate your event</h2>
          <p className="mt-2 max-w-xl text-body text-ink-muted">
            Move the sliders. The total updates as you go — nothing is booked and nothing is charged.
          </p>
          <div className="mt-10">
            <GigRateCalculator />
          </div>
        </div>
      </section>

      {/* Explainer tile — dark. */}
      <section className="bg-tile text-white">
        <div className="mx-auto max-w-[1100px] px-4 py-20 sm:px-6">
          <h2 className="text-display-md font-semibold">Where the money goes</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            <Explainer title="The musician's rate">
              Set by the musician, never below {formatCurrency(FLOOR_RATE)} an hour. Experienced
              players, directors, and arrangers set their own higher rate.
            </Explainer>
            <Explainer title="Travel and equipment">
              Optional. Travel is reimbursed at {MILEAGE_RATE.toFixed(2)} per mile per musician,
              matching the federal standard rate. Equipment covers backline, PA, or a piano tuning.
            </Explainer>
            <Explainer title={`Coordination — ${DEFAULT_BROKER_PCT}%`}>
              What the directory keeps for matching, scheduling, confirming, and following up. It
              applies to the whole engagement, and it is always shown as its own line.
            </Explainer>
          </div>
        </div>
      </section>

      {/* Closing tile — light. */}
      <section className="bg-surface">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-display-md font-semibold text-ink">Ready when you are.</h2>
          <p className="mt-4 text-body text-ink-muted">
            Send a request and we&apos;ll confirm availability and the final cost before anyone is
            booked.
          </p>
          <div className="mt-8">
            <Button asChild>
              <Link href="/request-musician">Request a musician</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function Explainer({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-tagline font-semibold">{title}</h3>
      <p className="mt-3 text-body leading-relaxed text-white/70">{children}</p>
    </div>
  );
}
