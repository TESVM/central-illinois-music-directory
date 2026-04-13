import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/layout/section-heading";
import { faqItems } from "@/lib/site-data";

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Answers for churches, pastors, event planners, and musicians considering a profile."
      />
      <div className="mt-10 space-y-4">
        {faqItems.map((item) => (
          <Card key={item.question} className="rounded-[28px] bg-white/85 p-6">
            <h2 className="font-display text-2xl text-ink">{item.question}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-700">{item.answer}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
