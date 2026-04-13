import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/layout/section-heading";
import { musicians } from "@/lib/site-data";

const profile = musicians[0];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Musician Dashboard"
        title={`Welcome back, ${profile.name}`}
        description="A sample dashboard showing how a musician can track profile activity, inquiries, and availability."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          ["Profile views", "248"],
          ["Open inquiries", "6"],
          ["Upcoming unavailable dates", "3"]
        ].map(([label, value]) => (
          <Card key={label} className="rounded-[28px] bg-white/85 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">{label}</p>
            <p className="mt-4 font-display text-4xl text-ink">{value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-[32px] bg-white/85 p-6">
          <h2 className="font-display text-2xl text-ink">Profile completion</h2>
          <div className="mt-5 h-3 rounded-full bg-brand-50">
            <div className="h-3 w-[82%] rounded-full bg-gradient-to-r from-brand-700 to-rose" />
          </div>
          <p className="mt-4 text-sm text-stone-600">82% complete. Add one more media sample and a ministry reference to strengthen your listing.</p>
          <div className="mt-6 space-y-3 text-sm text-stone-700">
            <p>Primary role: {profile.primaryRole}</p>
            <p>Availability: {profile.availability}</p>
            <p>Churches listed: {profile.churches.length}</p>
          </div>
        </Card>

        <Card className="rounded-[32px] bg-white/85 p-6">
          <h2 className="font-display text-2xl text-ink">Recent inquiries</h2>
          <div className="mt-6 space-y-4">
            {[
              ["Hope Fellowship, Savoy", "Sunday worship coverage on April 28", "Awaiting reply"],
              ["Redeemer Church, Urbana", "Worship night keys + background vocals", "New"],
              ["Riverbend Community Church", "Mother's Day strings ensemble", "Follow-up requested"]
            ].map(([church, request, status]) => (
              <div key={church} className="rounded-[24px] border border-line bg-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold text-ink">{church}</p>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-900">{status}</span>
                </div>
                <p className="mt-2 text-sm text-stone-600">{request}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
