import { SectionHeading } from "@/components/layout/section-heading";
import { MusicianBrowser } from "@/components/site/musician-browser";
import { musicians } from "@/lib/site-data";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const filterKeys = ["instrument", "genre", "location", "experience", "availability", "churchType"] as const;

export default async function MusiciansPage({ searchParams }: Props) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialFilters = {
    instrument: "",
    genre: "",
    location: "",
    experience: "",
    availability: "",
    churchType: ""
  };

  filterKeys.forEach((key) => {
    const value = resolvedSearchParams[key];
    initialFilters[key] = typeof value === "string" ? value : "";
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Browse Musicians"
        title="Search local musicians by instrument, worship style, and church fit"
        description="Profiles include church history, event experience, availability, and direct contact paths."
      />
      <div className="mt-8 rounded-[28px] border border-line bg-white/85 p-6 shadow-card">
        <h2 className="font-display text-2xl text-ink">Simple way to use this page</h2>
        <ol className="mt-4 space-y-3 text-base leading-8 text-stone-700">
          <li>1. Pick an instrument or city if you already know what you need.</li>
          <li>2. Leave the other filters alone if you want broader results.</li>
          <li>3. Open a profile and use the contact details when someone looks like a fit.</li>
        </ol>
      </div>
      <div className="mt-10">
        <MusicianBrowser musicians={musicians} initialFilters={initialFilters} />
      </div>
    </div>
  );
}
