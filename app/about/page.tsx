import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/layout/section-heading";

const values = [
  "Make musician discovery easier for churches that need help quickly.",
  "Give musicians a profile format that reflects real ministry context.",
  "Keep the experience accessible, respectful, and easy to extend."
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="About"
        title="A local directory built for ministry planning, not generic booking"
        description="Central Illinois Music Ministry Directory is designed to help churches find capable, ministry-ready musicians while giving local artists a clear and professional public profile."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {values.map((item) => (
          <Card key={item} className="rounded-[28px] bg-white/85 p-6">
            <p className="text-lg leading-8 text-stone-700">{item}</p>
          </Card>
        ))}
      </div>
      <div className="mt-10 rounded-[32px] border border-line bg-white/85 p-8 shadow-card">
        <h2 className="font-display text-3xl text-ink">Why this exists</h2>
        <p className="mt-4 text-base leading-8 text-stone-700">
          Churches often need a substitute pianist, worship vocalist, drummer, guitarist, sound engineer, or conference musician on short notice. At the same time, many gifted local musicians do not have a ministry-focused profile that explains where they have served, what styles they know, and how churches can contact them. This site bridges that gap.
        </p>
      </div>
    </div>
  );
}
