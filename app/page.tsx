import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Church, MapPin, Mic2, Music2, ShieldCheck } from "lucide-react";
import { HeroSearch } from "@/components/site/hero-search";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/layout/section-heading";
import { getFeaturedMusicians, instrumentPhotos, testimonials } from "@/lib/site-data";
import { churchDirectoryUrl } from "@/lib/utils";

const featuredMusicians = getFeaturedMusicians();

const quickLinks = [
  {
    title: "Browse musicians",
    description: "Jump straight to the searchable directory.",
    href: "/musicians"
  },
  {
    title: "Create profile",
    description: "Build a ministry-friendly public profile.",
    href: "/create-profile"
  },
  {
    title: "Request musicians",
    description: "Tell churches and planners what kind of player you need.",
    href: "/church-search-request"
  },
  {
    title: "Browse churches",
    description: "Open the church directory in a new tab.",
    href: churchDirectoryUrl("/")
  }
];

const steps = [
  {
    title: "Browse by ministry need",
    description:
      "Filter by instrument, worship style, church type, and availability to quickly narrow the field."
  },
  {
    title: "Review trusted profiles",
    description:
      "See experience, churches served, event history, media samples, and direct contact details in one place."
  },
  {
    title: "Reach out and book",
    description:
      "Contact musicians directly for Sunday coverage, conferences, youth nights, and special events."
  }
];

export default function HomePage() {
  return (
    <div className="pb-20">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:pt-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">
            Central Illinois Music Ministry Network
          </p>
          <h1 className="mt-5 font-display text-5xl leading-tight text-ink sm:text-6xl">
            Find dependable musicians for churches, worship nights, and ministry events in Champaign-Urbana.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
            A ministry-friendly directory for pastors, worship leaders, and event planners who need vocalists,
            instrumentalists, and accompanists with real church experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/musicians">
                Browse Musicians
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/create-profile">Create Your Profile</Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href={churchDirectoryUrl("/")} target="_blank" rel="noreferrer">
                <Church className="mr-2 h-4 w-4" />
                Browse Churches
              </a>
            </Button>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["80+", "Profiles across Central Illinois"],
              ["24h", "Typical response window for inquiries"],
              ["AA", "Accessibility-first design baseline"]
            ].map(([value, label]) => (
              <Card key={label} className="rounded-[24px] border-white/70 bg-white/80 p-5">
                <p className="text-2xl font-semibold text-ink">{value}</p>
                <p className="mt-2 text-sm text-stone-600">{label}</p>
              </Card>
            ))}
          </div>
        </div>

        <aside className="section-strong rounded-[36px] border border-white/70 p-6 shadow-soft sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-card">
              <Music2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Quick Search</p>
              <p className="text-sm text-stone-600">Find musicians by instrument, style, and schedule.</p>
            </div>
          </div>
          <div className="mt-6">
            <HeroSearch />
          </div>
          <div className="mt-6 rounded-[28px] border border-white/70 bg-white/75 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">Easy to navigate</p>
            <p className="mt-3 text-sm leading-7 text-stone-700">
              Clear labels, visible focus states, keyboard-friendly controls, and readable contrast help pastors and planners move quickly.
            </p>
          </div>
        </aside>
      </section>

      <section aria-labelledby="quick-links-heading" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[36px] border border-white/70 bg-white/85 p-6 shadow-card sm:p-8">
          <h2 id="quick-links-heading" className="font-display text-3xl text-ink">
            Quick paths
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickLinks.map((item) => (
              <Card key={item.title} className="rounded-[24px] border-white/80 bg-brand-50/60 p-5">
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-stone-700">{item.description}</p>
                {item.href.startsWith("http") ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-brand-900 underline-offset-4 hover:underline focus-ring">
                    Open link
                  </a>
                ) : (
                  <Link href={item.href} className="mt-4 inline-flex text-sm font-semibold text-brand-900 underline-offset-4 hover:underline focus-ring">
                    Open link
                  </Link>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Featured Musicians"
          title="Profiles built for worship planning, not generic gig hunting"
          description="Review local musicians with church context, ministry references, and practical availability details before you reach out."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {featuredMusicians.map((musician) => (
            <Card key={musician.slug} className="overflow-hidden rounded-[32px]">
              <div className={`h-48 ${musician.accentClass} p-6 text-white`}>
                <div
                  role="img"
                  aria-label={`${musician.name} profile portrait placeholder`}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-2xl font-semibold backdrop-blur"
                >
                  {musician.initials}
                </div>
                <p className="mt-12 text-sm font-semibold uppercase tracking-[0.22em] text-white/80">{musician.city}</p>
                <h3 className="mt-2 font-display text-3xl">{musician.name}</h3>
                <p className="mt-1 text-sm text-white/85">{musician.primaryRole}</p>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex flex-wrap gap-2 text-xs font-medium text-brand-900">
                  {musician.genres.slice(0, 3).map((genre) => (
                    <span key={genre} className="rounded-full bg-brand-50 px-3 py-1">
                      {genre}
                    </span>
                  ))}
                </div>
                <p className="text-sm leading-7 text-stone-600">{musician.shortBio}</p>
                <div className="grid gap-3 text-sm text-stone-700 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Mic2 className="h-4 w-4 text-brand-700" />
                    {musician.primaryRole}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-700" />
                    {musician.city}
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-brand-700" />
                    {musician.yearsExperience} years experience
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-brand-700" />
                    {musician.availability}
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/musicians/${musician.slug}`}>View profile</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="section-wash border-y border-white/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How It Works"
            title="A simpler path from search to Sunday"
            description="Built for churches that need capable help quickly, and for musicians who want a clear, professional profile."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={step.title} className="rounded-[28px] bg-white/85 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-700 text-lg font-semibold text-white">
                  {index + 1}
                </div>
                <h3 className="mt-5 font-display text-2xl text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Church Endorsements"
          title="Trusted by worship teams, pastors, and event planners across the region"
          description="Sample endorsements demonstrate the tone and information architecture for future production content."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={item.name} className="rounded-[28px] bg-white/85 p-6">
              <p className="text-base leading-8 text-stone-700">“{item.quote}”</p>
              <div className="mt-6 border-t border-line pt-4">
                <p className="font-semibold text-ink">{item.name}</p>
                <p className="text-sm text-stone-600">{item.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="instrument-gallery-heading" className="section-wash border-y border-white/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Instrument Gallery"
            title="See the kinds of instruments churches often need most"
            description="These photo cards make the site feel warmer and more visual while still keeping each image labeled and easy to understand."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {instrumentPhotos.map((photo) => (
              <Card key={photo.title} className="overflow-hidden rounded-[28px] bg-white/90">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={1200}
                  height={840}
                  className="h-56 w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="font-display text-2xl text-ink">{photo.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-stone-700">{photo.caption}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] bg-[linear-gradient(135deg,#12363e,#2f8f88_55%,#f28b66)] px-8 py-10 text-white shadow-soft sm:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">For Musicians</p>
            <h2 className="mt-4 font-display text-4xl">Create a profile that churches can trust at first glance.</h2>
            <p className="mt-4 text-lg leading-8 text-white/88">
              Share your background, ministry history, social links, and media in a format built for church hiring decisions.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/create-profile">Start your profile</Link>
            </Button>
            <Button asChild className="bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20">
              <Link href="/church-search-request">Request musicians for an event</Link>
            </Button>
            <Button asChild className="bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20">
              <a href={churchDirectoryUrl("/")} target="_blank" rel="noreferrer">
                Browse the church directory
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
