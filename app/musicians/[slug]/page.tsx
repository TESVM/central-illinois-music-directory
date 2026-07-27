import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { ExampleBadge, ExampleNotice } from "@/components/site/example-notice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { enforceFloor, formatRate, isFloorRate } from "@/lib/rates";
import { getMusicianBySlug, instrumentPhotos, musicians } from "@/lib/site-data";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return musicians.map((musician) => ({ slug: musician.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const musician = getMusicianBySlug(slug);
  return {
    title: musician ? musician.name : "Musician profile",
    description: musician?.shortBio
  };
}

export default async function MusicianProfilePage({ params }: Props) {
  const { slug } = await params;
  const musician = getMusicianBySlug(slug);

  if (!musician) {
    notFound();
  }

  const rate = enforceFloor(musician.hourlyRate);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-lg border border-line bg-surface">
        <div className="border-b border-line-soft p-8 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-5">
              <div
                role="img"
                aria-label={`${musician.name} profile portrait placeholder`}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-pearl text-2xl font-semibold text-ink-muted ring-1 ring-line-soft"
              >
                {musician.initials}
              </div>
              <div>
                <p className="text-sm text-ink-subtle">{musician.city}, Illinois</p>
                <h1 className="mt-1 text-display-lg font-semibold text-ink">{musician.name}</h1>
                <p className="mt-1 text-tagline font-normal text-ink-muted">{musician.primaryRole}</p>
                {musician.example && <ExampleBadge className="mt-3" />}
              </div>
            </div>

            <div className="text-right">
              <p className="text-display-md font-semibold text-ink">{formatRate(rate)}</p>
              <p className="text-sm text-ink-subtle">
                {isFloorRate(rate) ? "Starting rate" : "Set by this musician"}
              </p>
            </div>
          </div>

          {/*
            Sample listings must not offer a contact button — the address is a
            placeholder, and mailing it would go nowhere.
          */}
          {musician.example ? (
            <>
              <ExampleNotice className="mt-8" />
              <div className="mt-5">
                <Button asChild>
                  <Link href="/request-musician">Tell us what you need</Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/request-musician">Request this musician</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href={`mailto:${musician.email}`}>Contact by email</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-8 p-8 lg:grid-cols-[0.72fr_0.28fr]">
          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-display-md font-semibold text-ink">About</h2>
              <p className="mt-4 text-body leading-relaxed text-ink-muted">{musician.bio}</p>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-6">
                <h2 className="text-tagline font-semibold text-ink">Churches served</h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">
                  {musician.churches.map((church) => (
                    <li key={church}>{church}</li>
                  ))}
                </ul>
              </Card>
              <Card className="p-6">
                <h2 className="text-tagline font-semibold text-ink">Events and stages</h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">
                  {musician.events.map((event) => (
                    <li key={event}>{event}</li>
                  ))}
                </ul>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-tagline font-semibold text-ink">Media gallery</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {musician.media.map((item) => (
                  <div
                    key={item}
                    role="img"
                    aria-label={`${item} placeholder media tile`}
                    className="rounded-md bg-pearl p-5 ring-1 ring-line-soft"
                  >
                    <p className="text-sm text-ink-subtle">Media sample</p>
                    <p className="mt-2 text-body font-semibold text-ink">{item}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-tagline font-semibold text-ink">Instrument inspiration</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {instrumentPhotos.slice(0, 2).map((photo) => (
                  <div key={photo.title} className="overflow-hidden rounded-md border border-line bg-surface">
                    <Image src={photo.src} alt={photo.alt} width={1200} height={840} className="h-48 w-full object-cover" />
                    <div className="p-4">
                      <p className="font-semibold text-ink">{photo.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-subtle">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="p-6">
              <h2 className="text-tagline font-semibold text-ink">Profile details</h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink-muted">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-1 h-4 w-4 text-brand-700" />
                  <span>{musician.yearsExperience} years of playing and singing experience</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-brand-700" />
                  <span>{musician.city}</span>
                </div>
                {/* Placeholder contact details are withheld rather than shown as real. */}
                {musician.example ? (
                  <div className="flex items-start gap-3">
                    <Mail className="mt-1 h-4 w-4 text-ink-subtle" />
                    <span className="text-ink-subtle">
                      Contact details are shown once a real musician claims this listing.
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <Phone className="mt-1 h-4 w-4 text-brand-700" />
                      <span>{musician.phone}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="mt-1 h-4 w-4 text-brand-700" />
                      <span>{musician.email}</span>
                    </div>
                  </>
                )}
                <p><strong>Availability:</strong> {musician.availability}</p>
                <p><strong>Styles:</strong> {musician.genres.join(", ")}</p>
                <p><strong>Church experience:</strong> {musician.churchExperience}</p>
              </div>
            </Card>

            {/* Sample profiles carry placeholder social URLs that resolve to nothing. */}
            {!musician.example && (
              <Card className="p-6">
                <h2 className="text-tagline font-semibold text-ink">Social links</h2>
                <div className="mt-5 space-y-3 text-sm text-brand-700">
                  <a className="block underline-offset-4 hover:underline focus-ring" href={musician.facebook}>Facebook</a>
                  <a className="block underline-offset-4 hover:underline focus-ring" href={musician.instagram}>Instagram</a>
                  <a className="block underline-offset-4 hover:underline focus-ring" href={musician.linkedin}>LinkedIn</a>
                  <a className="block underline-offset-4 hover:underline focus-ring" href={`https://wa.me/${musician.whatsapp.replace(/\D/g, "")}`}>WhatsApp</a>
                </div>
              </Card>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
