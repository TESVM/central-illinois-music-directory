import { SectionHeading } from "@/components/layout/section-heading";
import { CreateProfileForm } from "@/components/site/create-profile-form";

export default function CreateProfilePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Create Profile"
        title="Build a public profile that churches can review quickly"
        description="This multi-step form captures the details pastors and worship leaders usually ask for before they book someone."
      />
      <div className="mt-10">
        <CreateProfileForm />
      </div>
    </div>
  );
}
