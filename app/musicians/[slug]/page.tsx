import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[36px] border border-line bg-white/90 shadow-soft">
        <div className={`p-8 text-white sm:p-10 ${musician.accentClass}`}>
          <div
            role="img"
            aria-label={`${musician.name} profile portrait placeholder`}
            className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-white/30 bg-white/15 text-2xl font-semibold"
          >
            {musician.initials}
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-white/80">{musician.city}, Illinois</p>
          <h1 className="mt-3 font-display text-5xl">{musician.name}</h1>
          <p className="mt-2 text-lg text-white/88">{musician.primaryRole}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href={`mailto:${musician.email}`}>Contact by email</Link>
            </Button>
            <Button asChild className="bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20">
              <Link href="/church-search-request">Request booking support</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-8 p-8 lg:grid-cols-[0.72fr_0.28fr]">
          <div className="space-y-8">
            <Card className="rounded-[28px] bg-white/85 p-6">
              <h2 className="font-display text-3xl text-ink">About</h2>
              <p className="mt-4 text-base leading-8 text-stone-700">{musician.bio}</p>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="rounded-[28px] bg-white/85 p-6">
                <h2 className="font-display text-2xl text-ink">Churches served</h2>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
                  {musician.churches.map((church) => (
                    <li key={church}>{church}</li>
                  ))}
                </ul>
              </Card>
              <Card className="rounded-[28px] bg-white/85 p-6">
                <h2 className="font-display text-2xl text-ink">Events and stages</h2>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-700">
                  {musician.events.map((event) => (
                    <li key={event}>{event}</li>
                  ))}
                </ul>
              </Card>
            </div>

            <Card className="rounded-[28px] bg-white/85 p-6">
              <h2 className="font-display text-2xl text-ink">Media gallery</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {musician.media.map((item, index) => (
                  <div
                    key={item}
                    role="img"
                    aria-label={`${item} placeholder media tile`}
                    className={`rounded-[24px] p-5 text-white shadow-card ${index % 2 === 0 ? "bg-[linear-gradient(135deg,#2f8f88,#12363e)]" : "bg-[linear-gradient(135deg,#f28b66,#8b5e3c)]"}`}
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">Media sample</p>
                    <p className="mt-3 font-display text-2xl">{item}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[28px] bg-white/85 p-6">
              <h2 className="font-display text-2xl text-ink">Instrument inspiration</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {instrumentPhotos.slice(0, 2).map((photo) => (
                  <div key={photo.title} className="overflow-hidden rounded-[24px] border border-line bg-surface">
                    <Image src={photo.src} alt={photo.alt} width={1200} height={840} className="h-48 w-full object-cover" />
                    <div className="p-4">
                      <p className="font-semibold text-ink">{photo.title}</p>
                      <p className="mt-2 text-sm leading-7 text-stone-600">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="rounded-[28px] bg-white/85 p-6">
              <h2 className="font-display text-2xl text-ink">Profile details</h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-stone-700">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-1 h-4 w-4 text-brand-700" />
                  <span>{musician.yearsExperience} years of playing and singing experience</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-brand-700" />
                  <span>{musician.city}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-1 h-4 w-4 text-brand-700" />
                  <span>{musician.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-1 h-4 w-4 text-brand-700" />
                  <span>{musician.email}</span>
                </div>
                <p><strong>Availability:</strong> {musician.availability}</p>
                <p><strong>Styles:</strong> {musician.genres.join(", ")}</p>
                <p><strong>Church experience:</strong> {musician.churchExperience}</p>
              </div>
            </Card>

            <Card className="rounded-[28px] bg-white/85 p-6">
              <h2 className="font-display text-2xl text-ink">Social links</h2>
              <div className="mt-5 space-y-3 text-sm text-brand-900">
                <a className="block underline-offset-4 hover:underline focus-ring" href={musician.facebook}>Facebook</a>
                <a className="block underline-offset-4 hover:underline focus-ring" href={musician.instagram}>Instagram</a>
                <a className="block underline-offset-4 hover:underline focus-ring" href={musician.linkedin}>LinkedIn</a>
                <a className="block underline-offset-4 hover:underline focus-ring" href={`https://wa.me/${musician.whatsapp.replace(/\D/g, "")}`}>WhatsApp</a>
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}
