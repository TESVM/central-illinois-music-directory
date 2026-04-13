import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/layout/section-heading";

const sections = [
  {
    title: "Terms of use",
    body:
      "Profiles and request forms are provided for legitimate ministry and event planning use. Users should provide accurate information and communicate respectfully."
  },
  {
    title: "Privacy",
    body:
      "Contact details and profile submissions should be used for directory operations, matching, moderation, and communication related to booking inquiries."
  },
  {
    title: "Moderation",
    body:
      "Submitted profiles may be reviewed before they become public, especially when links, media, or church references need verification."
  }
];

export default function TermsPrivacyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Terms & Privacy"
        title="Clear expectations for directory use and profile publishing"
        description="This is sample production-ready page structure for legal content and privacy disclosures."
      />
      <div className="mt-10 space-y-4">
        {sections.map((section) => (
          <Card key={section.title} className="rounded-[28px] bg-white/85 p-6">
            <h2 className="font-display text-2xl text-ink">{section.title}</h2>
            <p className="mt-3 text-sm leading-7 text-stone-700">{section.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
