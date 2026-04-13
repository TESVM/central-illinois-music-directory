"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const filters = {
  instrument: ["", "Vocals", "Piano", "Keys", "Drums", "Guitar", "Violin"],
  genre: ["", "Contemporary Worship", "Gospel", "Hymns", "Acoustic", "Instrumental"],
  location: ["", "Champaign", "Urbana", "Savoy", "Mahomet", "Rantoul"],
  experience: ["", "5+", "10+", "15+"],
  availability: ["", "Weekends", "Weekends and evenings", "Seasonal events", "Flexible"],
  churchType: ["", "Non-denominational", "Baptist", "Pentecostal", "Traditional", "Campus Ministry"]
};

export function HeroSearch() {
  const router = useRouter();
  const [form, setForm] = useState({
    instrument: "",
    genre: "",
    location: "",
    experience: "",
    availability: "",
    churchType: ""
  });

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/musicians${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} aria-describedby="hero-search-help">
      <p id="hero-search-help" className="text-sm leading-7 text-stone-700">
        Choose any filters you want. You can use just one or mix several together.
      </p>
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="sr-only">Find musicians by instrument, style, location, experience, availability, and church type</legend>
        {Object.entries(filters).map(([name, options]) => (
          <label key={name} className="text-sm font-medium text-stone-700">
            <span className="capitalize">{name === "churchType" ? "Church type" : name}</span>
            <select
              value={form[name as keyof typeof form]}
              onChange={(event) => updateField(name as keyof typeof form, event.target.value)}
              className="focus-ring mt-2 h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink shadow-sm"
            >
              {options.map((option) => (
                <option key={option || "all"} value={option}>
                  {option || "Any"}
                </option>
              ))}
            </select>
          </label>
        ))}
      </fieldset>
      <Button type="submit" className="w-full">
        Browse matching musicians
      </Button>
    </form>
  );
}
