import type { Metadata } from "next";
import { GigRequestForm } from "@/components/gigs/gig-request-form";
import { TrustStrip } from "@/components/site/trust-strip";
import { FLOOR_RATE, formatCurrency } from "@/lib/rates";

export const metadata: Metadata = {
  title: "Request a musician",
  description:
    "Tell us about your service or event and we'll match you with available Central Illinois musicians. Free to ask, and nothing is booked until you confirm."
};

export default function RequestMusicianPage() {
  return (
    <>
      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <h1 className="text-display-lg font-semibold text-ink">Request a musician</h1>
          <p className="mx-auto mt-4 max-w-xl text-lead font-normal text-ink-muted">
            Three short steps. You&apos;ll see the cost as you go, and nothing is booked until you
            confirm.
          </p>
          <p className="mt-4 text-sm text-ink-subtle">
            Musicians on this directory are never booked below {formatCurrency(FLOOR_RATE)} an hour.
          </p>
        </div>
      </section>

      <TrustStrip />

      <section className="bg-canvas">
        <div className="mx-auto max-w-[1100px] px-4 pb-24 pt-12 sm:px-6">
          <GigRequestForm />
        </div>
      </section>
    </>
  );
}
