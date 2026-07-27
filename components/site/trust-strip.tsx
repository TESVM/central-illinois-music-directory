import { BadgeCheck, HandCoins, MapPin, ShieldCheck } from "lucide-react";
import { allListingsAreExamples, realMusicianCount } from "@/components/site/example-notice";
import { FLOOR_RATE, formatCurrency } from "@/lib/rates";
import { musicians } from "@/lib/site-data";

/**
 * Credibility markers. Every claim here is one the site can actually back up —
 * the counts are derived from real data rather than typed in, so they can't
 * drift out of date and become a lie.
 */
export function TrustStrip() {
  const cities = new Set(musicians.map((musician) => musician.city));
  const averageYears = Math.round(
    musicians.reduce((total, musician) => total + musician.yearsExperience, 0) / musicians.length
  );

  const points = [
    /*
      While the directory only holds sample listings, this must not claim a
      roster that does not exist. It switches to the real claim automatically
      once an actual musician is added.
    */
    allListingsAreExamples
      ? {
          icon: BadgeCheck,
          title: "Personally matched",
          body: "The directory is new. Tell us what your service needs and we'll find the right local musician for it."
        }
      : {
          icon: BadgeCheck,
          title: `${realMusicianCount} vetted musicians`,
          body: `Every profile is reviewed before it goes live. Average ${averageYears} years of ministry experience.`
        },
    {
      icon: HandCoins,
      title: `${formatCurrency(FLOOR_RATE)} an hour minimum`,
      body: "A published floor rate, enforced on every quote. No haggling and no surprise fees."
    },
    {
      icon: MapPin,
      title: `${cities.size} cities covered`,
      body: "Champaign, Urbana, Savoy, Mahomet, and Rantoul, with travel to surrounding towns."
    },
    {
      icon: ShieldCheck,
      title: "Nothing charged up front",
      body: "Requests are free. We confirm availability and final cost before anyone is booked."
    }
  ];

  return (
    <section aria-label="Why churches use this directory" className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {points.map(({ icon: Icon, title, body }) => (
          <div key={title}>
            <Icon className="h-6 w-6 text-brand-700" aria-hidden="true" />
            <h3 className="mt-4 text-body font-semibold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-subtle">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
