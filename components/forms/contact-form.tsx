"use client";

import { useActionState } from "react";
import { submitContactAction, type FormResult } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const INITIAL: FormResult = { status: "idle", message: "" };
const CONTACT_EMAIL = "hello@centralilmusicministry.com";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactAction, INITIAL);

  if (state.status === "success") {
    return (
      <div>
        <h2 className="text-tagline font-semibold text-ink">Message received</h2>
        <p className="mt-2 text-body text-ink-muted">{state.message}</p>

        {/*
          Be honest when no mail provider is configured: the message is recorded,
          but it will not land in an inbox on its own.
        */}
        {state.delivered === false && (
          <p className="mt-4 text-sm leading-relaxed text-ink-subtle">
            If it&apos;s time-sensitive, please also email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-700 underline">
              {CONTACT_EMAIL}
            </a>{" "}
            directly.
          </p>
        )}
      </div>
    );
  }

  // method="post" is explicit so a submit landing before hydration still posts
  // the body. Without it the browser falls back to GET and puts the sender's
  // name, email, and message into the URL.
  return (
    <form method="post" action={formAction} className="space-y-5" aria-describedby="contact-form-help">
      <p id="contact-form-help" className="text-sm text-ink-subtle">
        Required fields are marked. If you&apos;re not sure what to write, keep it short and tell us
        what you need help with.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-ink">
          Name <span aria-hidden="true">*</span>
          <Input required name="name" autoComplete="name" className="mt-2 font-normal" />
        </label>
        <label className="block text-sm font-semibold text-ink">
          Email <span aria-hidden="true">*</span>
          <Input
            required
            type="email"
            name="email"
            autoComplete="email"
            className="mt-2 font-normal"
          />
        </label>
      </div>

      <label className="block text-sm font-semibold text-ink">
        Organization
        <Input name="organization" className="mt-2 font-normal" autoComplete="organization" />
      </label>

      <label className="block text-sm font-semibold text-ink">
        Message <span aria-hidden="true">*</span>
        <Textarea required name="message" rows={5} className="mt-2 font-normal" />
      </label>

      {state.status === "error" && (
        <p role="alert" className="text-sm text-ink">
          {state.message}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
