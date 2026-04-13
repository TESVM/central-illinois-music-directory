import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/layout/section-heading";

export default function ChurchSearchRequestPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Church Search Request"
        title="Describe the musicians you need for your service or event"
        description="Use this request form when you want help sourcing musicians instead of browsing profiles one by one."
      />
      <Card className="mt-10 rounded-[32px] bg-white/90 p-6 sm:p-8">
        <form className="grid gap-5 sm:grid-cols-2" aria-describedby="request-form-help">
          <p id="request-form-help" className="sm:col-span-2 text-sm leading-7 text-stone-700">
            Keep this simple. If you only know the event date, city, and instrument needed, that is enough to get started.
          </p>
          <label className="text-sm font-medium text-stone-700">
            Event type
            <Input className="mt-2" placeholder="Sunday worship, retreat, youth night" />
          </label>
          <label className="text-sm font-medium text-stone-700">
            Date
            <Input type="date" className="mt-2" />
          </label>
          <label className="text-sm font-medium text-stone-700">
            Location
            <Input className="mt-2" placeholder="Champaign, Urbana, Savoy" />
          </label>
          <label className="text-sm font-medium text-stone-700">
            Budget
            <Input className="mt-2" placeholder="Example: $200 to $800" />
          </label>
          <label className="text-sm font-medium text-stone-700">
            Needed instruments or roles
            <Input className="mt-2" placeholder="Example: keys, drums, alto vocalist" />
          </label>
          <label className="text-sm font-medium text-stone-700">
            Church size
            <Input className="mt-2" placeholder="Small, medium, large congregation" />
          </label>
          <label className="sm:col-span-2 text-sm font-medium text-stone-700">
            Worship style
            <Input className="mt-2" placeholder="Gospel, contemporary worship, blended, hymns" />
          </label>
          <label className="sm:col-span-2 text-sm font-medium text-stone-700">
            Notes
            <Textarea className="mt-2" placeholder="Share rehearsal expectations, soundcheck timing, song lists, or other details." />
          </label>
          <div className="sm:col-span-2">
            <Button type="submit">Submit request</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
