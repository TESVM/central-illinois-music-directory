"use client";

import { useActionState } from "react";
import { submitListingAction, type FormResult } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const INITIAL: FormResult = { status: "idle", message: "" };
const CONTACT_EMAIL = "hello@centralilmusicministry.com";

export function SubmitListingForm() {
  const [state, formAction, pending] = useActionState(submitListingAction, INITIAL);

  if (state.status === "success") {
    return (
      <div>
        <h2 className="text-tagline font-semibold text-ink">Listing received</h2>
        <p className="mt-2 text-body text-ink-muted">{state.message}</p>
        {state.delivered === false && (
          <p className="mt-4 text-sm leading-relaxed text-ink-subtle">
            You can also send a copy to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-700 underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        )}
      </div>
    );
  }

  // Explicit POST so a submit landing before hydration still sends a body
  // rather than falling back to GET and exposing the contact details in the URL.
  return (
    <form method="post" action={formAction} className="grid gap-4 md:grid-cols-2">
      <label className="block text-sm font-semibold text-ink">
        Church name <span aria-hidden="true">*</span>
        <Input required name="churchName" className="mt-2 font-normal" />
      </label>
      <label className="block text-sm font-semibold text-ink">
        City <span aria-hidden="true">*</span>
        <Input required name="city" className="mt-2 font-normal" />
      </label>
      <label className="block text-sm font-semibold text-ink">
        Your name <span aria-hidden="true">*</span>
        <Input required name="contactName" className="mt-2 font-normal" autoComplete="name" />
      </label>
      <label className="block text-sm font-semibold text-ink">
        Your email <span aria-hidden="true">*</span>
        <Input
          required
          type="email"
          name="contactEmail"
          className="mt-2 font-normal"
          autoComplete="email"
        />
      </label>
      <label className="block text-sm font-semibold text-ink">
        Website <span className="font-normal text-ink-subtle">(optional)</span>
        <Input
          name="websiteUrl"
          type="url"
          placeholder="https://"
          className="mt-2 font-normal"
        />
      </label>
      <label className="block text-sm font-semibold text-ink">
        Church app <span className="font-normal text-ink-subtle">(optional)</span>
        <Input name="appUrl" type="url" placeholder="https://" className="mt-2 font-normal" />
      </label>
      <label className="block text-sm font-semibold text-ink">
        Senior pastor <span aria-hidden="true">*</span>
        <Input required name="seniorPastor" className="mt-2 font-normal" />
      </label>
      <label className="block text-sm font-semibold text-ink">
        Service times <span aria-hidden="true">*</span>
        <Input
          required
          name="serviceTimes"
          placeholder="Sundays 9am and 11am"
          className="mt-2 font-normal"
        />
      </label>

      <label className="block text-sm font-semibold text-ink md:col-span-2">
        Description <span aria-hidden="true">*</span>
        <Textarea
          required
          name="description"
          rows={5}
          placeholder="Ministries, worship style, and anything visitors should know."
          className="mt-2 font-normal"
        />
      </label>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-ink md:col-span-2">
          {state.message}
        </p>
      )}

      <div className="md:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Sending…" : "Submit for review"}
        </Button>
      </div>
    </form>
  );
}
