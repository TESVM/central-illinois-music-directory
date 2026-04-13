import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/layout/section-heading";
import { moderationQueue } from "@/lib/site-data";

export default function AdminModerationPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Admin Moderation"
        title="Review pending musician profiles before publication"
        description="A sample moderation queue showing approval, edit, and rejection controls in an accessible table layout."
      />
      <Card className="mt-10 overflow-hidden rounded-[32px] bg-white/90">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <caption className="sr-only">Pending musician profile moderation queue</caption>
            <thead className="bg-brand-50 text-brand-900">
              <tr>
                <th className="px-6 py-4 font-semibold">Musician</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Submitted</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Notes</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {moderationQueue.map((item) => (
                <tr key={item.name} className="border-t border-line">
                  <td className="px-6 py-5 font-medium text-ink">{item.name}</td>
                  <td className="px-6 py-5 text-stone-700">{item.role}</td>
                  <td className="px-6 py-5 text-stone-700">{item.submittedAt}</td>
                  <td className="px-6 py-5">
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-900">{item.status}</span>
                  </td>
                  <td className="px-6 py-5 text-stone-700">{item.issue}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm">Approve</Button>
                      <Button size="sm" variant="secondary">Request edits</Button>
                      <Button size="sm" variant="ghost">Reject</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
