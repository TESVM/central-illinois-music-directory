"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MapPin, CalendarDays, ShieldCheck } from "lucide-react";
import { ExampleBadge, ExampleNotice } from "@/components/site/example-notice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { enforceFloor, formatRate, isFloorRate } from "@/lib/rates";
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
      if (sort === "rate-low") return enforceFloor(a.hourlyRate) - enforceFloor(b.hourlyRate);
      if (sort === "rate-high") return enforceFloor(b.hourlyRate) - enforceFloor(a.hourlyRate);
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
      <Card className="h-fit p-6">
        <h2 id="filter-heading" className="text-tagline font-semibold text-ink">
          Filters
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-subtle">
          Start with one filter, like instrument or city. Add more only if you need fewer results.
        </p>
        <div className="mt-6 space-y-4">
          {filterGroups.map(({ name, options }) => (
            <label key={name} className="block text-sm font-semibold text-ink">
              <span className="capitalize">{name === "churchType" ? "Church type" : name}</span>
              <select
                value={filters[name]}
                onChange={(event) => updateFilter(name, event.target.value)}
                className="focus-ring mt-2 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm font-normal text-ink"
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
        <ExampleNotice className="mb-5" />

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p id="results-heading" aria-live="polite" className="text-sm text-ink-subtle">
            {filtered.length} musician{filtered.length === 1 ? "" : "s"} found
          </p>
          <label className="text-sm font-semibold text-ink">
            Sort by
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="focus-ring ml-3 h-11 rounded-md border border-line bg-surface px-3 text-sm font-normal text-ink"
            >
              <option value="newest">Newest</option>
              <option value="most-experienced">Most experienced</option>
              <option value="closest">Closest</option>
              <option value="rate-low">Rate: low to high</option>
              <option value="rate-high">Rate: high to low</option>
            </select>
          </label>
        </div>

        {filtered.length === 0 ? (
          <Card className="p-10 text-center">
            <h2 className="text-display-md font-semibold text-ink">No matching musicians yet</h2>
            <p className="mt-3 text-body text-ink-muted">
              Adjust the filters, or tell us what you need and we&apos;ll find someone.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/request-musician">Request a musician</Link>
              </Button>
              <Button variant="secondary" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {filtered.map((musician) => {
              const rate = enforceFloor(musician.hourlyRate);
              return (
                <Card key={musician.slug} className="flex flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        role="img"
                        aria-label={`${musician.name} portrait placeholder`}
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-pearl text-body font-semibold text-ink-muted ring-1 ring-line-soft"
                      >
                        {musician.initials}
                      </div>
                      <div>
                        <h2 className="text-tagline font-semibold text-ink">{musician.name}</h2>
                        <p className="text-sm text-ink-subtle">{musician.primaryRole}</p>
                        {musician.example && <ExampleBadge className="mt-2" />}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-body font-semibold text-ink">{formatRate(rate)}</p>
                      {isFloorRate(rate) && (
                        <p className="text-xs text-ink-subtle">Starting rate</p>
                      )}
                    </div>
                  </div>

                  <p className="mt-5 text-body leading-relaxed text-ink-muted">
                    {musician.shortBio}
                  </p>

                  <p className="mt-4 text-sm text-ink">
                    <span className="text-ink-subtle">Plays:</span>{" "}
                    {musician.instruments.join(", ")}
                  </p>

                  <div className="mt-4 grid gap-2 text-sm text-ink-muted sm:grid-cols-2">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-ink-subtle" aria-hidden="true" />
                      {musician.city}
                    </span>
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-ink-subtle" aria-hidden="true" />
                      {musician.yearsExperience} years
                    </span>
                    <span className="flex items-center gap-2 sm:col-span-2">
                      <ShieldCheck className="h-4 w-4 text-ink-subtle" aria-hidden="true" />
                      {musician.availability}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {musician.genres.map((genre) => (
                      <span
                        key={genre}
                        className="rounded-full bg-pearl px-3 py-1 text-xs text-ink-muted ring-1 ring-line-soft"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 pt-1">
                    <Button asChild>
                      <Link href={`/musicians/${musician.slug}`}>View profile</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link href="/request-musician">Request</Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
