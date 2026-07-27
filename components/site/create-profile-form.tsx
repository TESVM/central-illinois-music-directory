"use client";

import { useEffect, useMemo, useState } from "react";
import { submitMusicianProfileAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FormState = {
  fullName: string;
  primaryRole: string;
  city: string;
  yearsExperience: string;
  churches: string;
  events: string;
  genres: string;
  availability: string;
  phone: string;
  email: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  media: string;
  bio: string;
};

const defaultState: FormState = {
  fullName: "",
  primaryRole: "",
  city: "",
  yearsExperience: "",
  churches: "",
  events: "",
  genres: "",
  availability: "",
  phone: "",
  email: "",
  whatsapp: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  media: "",
  bio: ""
};

const steps = [
  "Basic info",
  "Musical background",
  "Church and event history",
  "Contact and social links",
  "Media upload",
  "Review and submit"
];

export function CreateProfileForm() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<FormState>(defaultState);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [delivered, setDelivered] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem("musician-profile-draft");
    if (saved) {
      setState({ ...defaultState, ...JSON.parse(saved) });
    }
  }, []);

  function setField(field: keyof FormState, value: string) {
    setState((current) => ({ ...current, [field]: value }));
  }

  function saveDraft() {
    window.localStorage.setItem("musician-profile-draft", JSON.stringify(state));
    setMessage("Draft saved locally on this device.");
  }

  const currentError = useMemo(() => {
    if (step === 0 && (!state.fullName || !state.primaryRole || !state.city)) {
      return "Add your name, primary role, and city to continue.";
    }
    if (step === 1 && (!state.yearsExperience || !state.genres || !state.bio)) {
      return "Add your experience, genres, and bio to continue.";
    }
    if (step === 3 && (!state.email || !state.phone)) {
      return "Email and phone are required so churches can contact you.";
    }
    return "";
  }, [state, step]);

  function nextStep() {
    if (currentError) {
      setMessage(currentError);
      return;
    }
    setMessage("");
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function previousStep() {
    setMessage("");
    setStep((current) => Math.max(current - 1, 0));
  }

  async function submitForm() {
    setSubmitting(true);
    setMessage("");
    try {
      const result = await submitMusicianProfileAction({
        fullName: state.fullName,
        primaryRole: state.primaryRole,
        city: state.city,
        availability: state.availability,
        yearsExperience: state.yearsExperience,
        genres: state.genres,
        bio: state.bio,
        churches: state.churches,
        events: state.events,
        phone: state.phone,
        email: state.email,
        whatsapp: state.whatsapp,
        facebook: state.facebook,
        instagram: state.instagram,
        linkedin: state.linkedin,
        media: state.media
      });

      if (result.status === "error") {
        setMessage(result.message);
        return;
      }

      // Only clear the draft once the server has actually accepted it.
      window.localStorage.removeItem("musician-profile-draft");
      setDelivered(result.delivered !== false);
      setSubmitted(true);
    } catch {
      setMessage(
        "That didn't send. Check your connection and try again, or email us at hello@centralilmusicministry.com."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-line bg-surface p-8 text-center sm:p-12">
        <h2 className="text-display-md font-semibold text-ink">Profile received</h2>
        <p className="mx-auto mt-3 max-w-md text-body text-ink-muted">
          Thanks, {state.fullName || "friend"}. We&apos;ll review your details and get in touch at{" "}
          {state.email} before your profile goes live.
        </p>
        {delivered === false && (
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-subtle">
            To be sure it reaches us, you can also email a copy to{" "}
            <a href="mailto:hello@centralilmusicministry.com" className="text-brand-700 underline">
              hello@centralilmusicministry.com
            </a>
            .
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-line bg-surface p-6 sm:p-8">
      <div aria-label="Progress" className="mb-8">
        <div className="flex flex-wrap gap-3">
          {steps.map((label, index) => (
            <div
              key={label}
              aria-current={index === step ? "step" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-medium ${index === step ? "bg-brand-700 text-white" : "bg-brand-50 text-brand-900"}`}
            >
              {index + 1}. {label}
            </div>
          ))}
        </div>
      </div>

      <div aria-live="polite" role="status" className="min-h-6 text-sm text-brand-900">
        {message}
      </div>

      {step === 0 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-stone-700">
            Full name
            <Input value={state.fullName} onChange={(event) => setField("fullName", event.target.value)} className="mt-2" />
          </label>
          <label className="text-sm font-medium text-stone-700">
            Primary instrument or vocal role
            <Input value={state.primaryRole} onChange={(event) => setField("primaryRole", event.target.value)} className="mt-2" />
          </label>
          <label className="text-sm font-medium text-stone-700">
            City
            <Input value={state.city} onChange={(event) => setField("city", event.target.value)} className="mt-2" />
          </label>
          <label className="text-sm font-medium text-stone-700">
            Availability
            <Input value={state.availability} onChange={(event) => setField("availability", event.target.value)} className="mt-2" />
          </label>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-stone-700">
            Years played or sung
            <Input value={state.yearsExperience} onChange={(event) => setField("yearsExperience", event.target.value)} className="mt-2" />
          </label>
          <label className="text-sm font-medium text-stone-700">
            Music styles or genres
            <Input value={state.genres} onChange={(event) => setField("genres", event.target.value)} className="mt-2" />
          </label>
          <label className="sm:col-span-2 text-sm font-medium text-stone-700">
            Short bio
            <Textarea value={state.bio} onChange={(event) => setField("bio", event.target.value)} className="mt-2" />
          </label>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-5">
          <label className="text-sm font-medium text-stone-700">
            Churches you have played for
            <Textarea value={state.churches} onChange={(event) => setField("churches", event.target.value)} className="mt-2" />
          </label>
          <label className="text-sm font-medium text-stone-700">
            Events or stages you have performed on
            <Textarea value={state.events} onChange={(event) => setField("events", event.target.value)} className="mt-2" />
          </label>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            ["phone", "Phone"],
            ["email", "Email"],
            ["whatsapp", "WhatsApp"],
            ["facebook", "Facebook"],
            ["instagram", "Instagram"],
            ["linkedin", "LinkedIn"]
          ].map(([field, label]) => (
            <label key={field} className="text-sm font-medium text-stone-700">
              {label}
              <Input value={state[field as keyof FormState]} onChange={(event) => setField(field as keyof FormState, event.target.value)} className="mt-2" />
            </label>
          ))}
        </div>
      ) : null}

      {step === 4 ? (
        <label className="block text-sm font-medium text-stone-700">
          Media links or upload notes
          <Textarea value={state.media} onChange={(event) => setField("media", event.target.value)} className="mt-2" />
        </label>
      ) : null}

      {step === 5 ? (
        <div className="space-y-4 rounded-[28px] bg-brand-50 p-6 text-sm text-stone-700">
          <p className="font-semibold text-brand-900">Review your profile</p>
          <p>Name: {state.fullName || "Not provided"}</p>
          <p>Role: {state.primaryRole || "Not provided"}</p>
          <p>City: {state.city || "Not provided"}</p>
          <p>Experience: {state.yearsExperience || "Not provided"}</p>
          <p>Genres: {state.genres || "Not provided"}</p>
          <p>Availability: {state.availability || "Not provided"}</p>
          <p>Email: {state.email || "Not provided"}</p>
          <p>Phone: {state.phone || "Not provided"}</p>
          <p>Church history: {state.churches || "Not provided"}</p>
          <p>Event history: {state.events || "Not provided"}</p>
          <p>Media: {state.media || "Not provided"}</p>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={previousStep} disabled={step === 0}>
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button type="button" onClick={nextStep}>
            Next
          </Button>
        ) : (
          <Button type="button" onClick={submitForm} disabled={submitting}>
            {submitting ? "Sending…" : "Submit profile"}
          </Button>
        )}
        <Button type="button" variant="ghost" onClick={saveDraft}>
          Save and continue later
        </Button>
      </div>
    </div>
  );
}
