"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MapPin, CalendarDays, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Musician } from "@/lib/site-data";

type Props = {
  musicians: Musician[];
  initialFilters: Record<FilterKey, string>;
};

type FilterKey = "instrument" | "genre" | "location" | "experience" | "availability" | "churchType";

const filterGroups: Array<{ name: FilterKey; options: string[] }> = [
  { name: "instrument", options: ["", "Vocals", "Piano", "Keys", "Drums", "Guitar", "Violin"] },
  { name: "genre", options: ["", "Contemporary Worship", "Gospel", "Hymns", "Acoustic", "Instrumental"] },
  { name: "location", options: ["", "Champaign", "Urbana", "Savoy", "Mahomet", "Rantoul"] },
  { name: "experience", options: ["", "5+", "10+", "15+"] },
  { name: "availability", options: ["", "Weekends", "Weekends and evenings", "Seasonal events", "Flexible"] },
  { name: "churchType", options: ["", "Non-denominational", "Baptist", "Pentecostal", "Traditional", "Campus Ministry"] }
];

function matchesExperience(musician: Musician, value: string) {
  if (!value) return true;
  const years = Number.parseInt(value, 10);
  return musician.yearsExperience >= years;
}

export function MusicianBrowser({ musicians, initialFilters }: Props) {
  const [sort, setSort] = useState("newest");
  const [filters, setFilters] = useState(initialFilters);

  const filtered = useMemo(() => {
    const result = musicians.filter((musician) => {
      return (
        (!filters.instrument || musician.instruments.includes(filters.instrument)) &&
        (!filters.genre || musician.genres.includes(filters.genre)) &&
        (!filters.location || musician.city === filters.location) &&
        (!filters.availability || musician.availability.toLowerCase().includes(filters.availability.toLowerCase())) &&
        (!filters.churchType || musician.churchTypes.includes(filters.churchType)) &&
        matchesExperience(musician, filters.experience)
      );
    });

    return [...result].sort((a, b) => {
      if (sort === "most-experienced") return b.yearsExperience - a.yearsExperience;
      if (sort === "closest") return a.distanceMiles - b.distanceMiles;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [filters, musicians, sort]);

  function updateFilter(name: keyof typeof filters, value: string) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function clearFilters() {
    setFilters({
      instrument: "",
      genre: "",
      location: "",
      experience: "",
      availability: "",
      churchType: ""
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <Card className="h-fit rounded-[32px] bg-white/90 p-6">
        <h2 id="filter-heading" className="font-display text-2xl text-ink">Filters</h2>
        <p className="mt-2 text-sm leading-7 text-stone-600">
          Narrow the results with as many or as few filters as you want.
        </p>
        <p className="mt-2 text-sm leading-7 text-stone-700">
          Tip: start with just one filter like instrument or city, then add more only if you need fewer results.
        </p>
        <div className="mt-6 space-y-4">
          {filterGroups.map(({ name, options }) => (
            <label key={name} className="block text-sm font-medium text-stone-700">
              <span className="capitalize">{name === "churchType" ? "Church type" : name}</span>
              <select
                value={filters[name]}
                onChange={(event) => updateFilter(name, event.target.value)}
                className="focus-ring mt-2 h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink"
              >
                {options.map((option) => (
                  <option key={option || "all"} value={option}>
                    {option || "Any"}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <Button type="button" variant="ghost" className="mt-5" onClick={clearFilters}>
          Clear all filters
        </Button>
      </Card>

      <section aria-labelledby="results-heading">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p id="results-heading" aria-live="polite" className="text-sm text-stone-600">
            {filtered.length} musician{filtered.length === 1 ? "" : "s"} found
          </p>
          <label className="text-sm font-medium text-stone-700">
            Sort by
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="focus-ring ml-3 h-11 rounded-2xl border border-line bg-white px-4 text-sm text-ink"
            >
              <option value="newest">Newest</option>
              <option value="most-experienced">Most experienced</option>
              <option value="closest">Closest</option>
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <Card className="rounded-[32px] bg-white/90 p-10 text-center">
            <h2 className="font-display text-3xl text-ink">No matching musicians yet</h2>
            <p className="mt-3 text-stone-600">
              Adjust the filters or request musicians directly if your church has a more specific need.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild variant="secondary">
                <Link href="/church-search-request">Submit a request</Link>
              </Button>
              <Button onClick={clearFilters}>Clear filters</Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {filtered.map((musician) => (
              <Card key={musician.slug} className="overflow-hidden rounded-[32px] bg-white/90">
                <div className={`h-36 ${musician.accentClass} p-6 text-white`}>
                  <div className="flex items-center gap-4">
                    <div
                      role="img"
                      aria-label={`${musician.name} portrait placeholder`}
                      className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/30 bg-white/15 text-xl font-semibold"
                    >
                      {musician.initials}
                    </div>
                    <div>
                      <h2 className="font-display text-3xl">{musician.name}</h2>
                      <p className="text-sm text-white/85">{musician.primaryRole}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <p className="text-sm leading-7 text-stone-600">{musician.shortBio}</p>
                  <p className="text-base font-medium text-ink">Primary instruments: {musician.instruments.join(", ")}</p>
                  <div className="grid gap-3 text-sm text-stone-700 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-brand-700" />
                      {musician.city}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-brand-700" />
                      {musician.yearsExperience} years
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-brand-700" />
                      {musician.availability}
                    </div>
                    <div className="text-brand-900">{musician.churchExperience}</div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-medium text-brand-900">
                    {musician.genres.map((genre) => (
                      <span key={genre} className="rounded-full bg-brand-50 px-3 py-1">
                        {genre}
                      </span>
                    ))}
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/musicians/${musician.slug}`}>Contact and view profile</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
