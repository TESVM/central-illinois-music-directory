import type { Metadata } from "next";
import Link from "next/link";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { Button } from "@/components/ui/button";
import { BILLING_LIVE, PROMOTED_EXPLAINER } from "@/lib/plans";
import { FLOOR_RATE, formatCurrency } from "@/lib/rates";

export const metadata: Metadata = {
  title: "Pricing & memberships",
  description:
    "Free profiles for musicians and churches, with optional memberships for more visibility and faster hiring. Clear prices, no hidden fees, cancel anytime."
};

const FAQS: Array<{ question: string; answer: string }> = [
  {
    question: "Is the free plan really free?",
    answer:
      "Yes. A musician can build a real profile and be found by churches without paying anything, and a church can search the directory and post a need for free. There is no card required and no time limit. Paid plans add reach and tools — they do not unlock basic access."
  },
  {
    question: "What happens if I cancel?",
    answer:
      "You keep your profile. Cancelling removes the paid features at the end of the period you already paid for, and your listing stays live on the free plan. Nothing is deleted and you are never locked out of your own information."
  },
  {
    question: "Do paid plans guarantee I get booked?",
    answer:
      "No, and we won't claim otherwise. A paid plan improves how easily churches can find you — better placement, more samples, instant alerts. Whether a church books you is still up to them."
  },
  {
    question: "Are featured profiles just ads?",
    answer: PROMOTED_EXPLAINER
  },
  {
    question: "Do you take a cut of what I'm paid?",
    answer: `No. Your rate is yours. The directory does not take a commission from a musician's pay, honorarium, or offering. Musicians are never listed below ${formatCurrency(FLOOR_RATE)} an hour, and if booking payments are ever added, any fee will be shown before you agree to it.`
  },
  {
    question: "Can my whole worship team share one account?",
    answer:
      "Yes. Group Pro covers a praise team, choir, band, or production team with one subscription, multiple administrators, and a shared booking calendar. Individual members can still keep their own free profiles."
  },
  {
    question: "What if our church needs something different?",
    answer:
      "Get in touch. Multi-campus churches, conferences, and organizations with unusual needs are exactly who the Ministry Network plan exists for, and we would rather shape it around how you actually work."
  }
];

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24">
          <h1 className="text-display-lg font-semibold text-ink sm:text-hero">
            Start free. Upgrade when your ministry needs more reach.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lead font-normal text-ink-muted">
            Musicians and churches both get a genuinely useful free account. Paid memberships add
            visibility, speed, and better tools — never basic access.
          </p>

          {!BILLING_LIVE && (
            <p
              role="note"
              className="mx-auto mt-8 max-w-xl rounded-lg border border-line bg-pearl p-4 text-sm leading-relaxed text-ink-muted"
            >
              <span className="font-semibold text-ink">Memberships open soon.</span> Free profiles
              work today. Paid plans are listed so you can see what&apos;s coming and what it will
              cost — nothing is charged, and no card is collected.
            </p>
          )}
        </div>
      </section>

      {/* Plans */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-[1100px] px-4 py-20 sm:px-6">
          <PricingPlans />
        </div>
      </section>

      {/* Principles */}
      <section className="bg-tile text-white">
        <div className="mx-auto max-w-[1100px] px-4 py-20 sm:px-6">
          <h2 className="text-display-md font-semibold">How we handle your money</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            <Principle title="No commission on your pay">
              The directory never takes a percentage of a musician&apos;s honorarium or fee. A
              membership is a flat price, and that is the whole arrangement.
            </Principle>
            <Principle title="Promoted means promoted">
              Featured placement is always labeled. Paid visibility is never disguised as a neutral
              search result.
            </Principle>
            <Principle title="Cancel from your dashboard">
              No phone call, no retention maze. You see the price before checkout, you get a receipt
              and a renewal notice, and your free profile survives a downgrade.
            </Principle>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="text-display-md font-semibold text-ink">Common questions</h2>
          <dl className="mt-10 divide-y divide-line-soft">
            {FAQS.map((faq) => (
              <div key={faq.question} className="py-6">
                <dt className="text-tagline font-semibold text-ink">{faq.question}</dt>
                <dd className="mt-3 text-body leading-relaxed text-ink-muted">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-display-md font-semibold text-ink">
            Not sure which plan fits?
          </h2>
          <p className="mt-4 text-body text-ink-muted">
            Tell us how your church or ministry works and we&apos;ll point you to the right one —
            including the free one, if that&apos;s genuinely the better fit.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/contact">Talk to us</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/create-profile">Create a free profile</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function Principle({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-tagline font-semibold">{title}</h3>
      <p className="mt-3 text-body leading-relaxed text-white/70">{children}</p>
    </div>
  );
}
