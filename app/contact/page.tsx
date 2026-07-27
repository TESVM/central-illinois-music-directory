import { ContactForm } from "@/components/forms/contact-form";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/layout/section-heading";

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div>
        <SectionHeading
          eyebrow="Contact"
          title="Questions, partnerships, or launch interest"
          description="Use this page for ministry partnerships, musician onboarding questions, or accessibility feedback."
        />
        <div className="mt-8 space-y-4">
          {[
            ["Email", "hello@centralilmusicministry.com"],
            ["Region", "Champaign-Urbana and surrounding Central Illinois communities"],
            ["Response window", "Typically within one business day"]
          ].map(([label, value]) => (
            <Card key={label} className="p-5">
              <p className="text-sm font-semibold text-brand-700">{label}</p>
              <p className="mt-2 text-body text-ink-muted">{value}</p>
            </Card>
          ))}
        </div>
      </div>
      <Card className="p-6 sm:p-8">
        <ContactForm />
      </Card>
    </div>
  );
}
