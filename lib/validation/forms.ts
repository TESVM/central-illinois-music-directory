import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10)
});

export const submitListingSchema = z.object({
  churchName: z.string().min(2),
  city: z.string().min(2),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  appUrl: z.string().url().optional().or(z.literal("")),
  seniorPastor: z.string().min(2),
  serviceTimes: z.string().min(2),
  description: z.string().min(20)
});

export const gigRequestSchema = z.object({
  organization: z.string().min(2),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional().or(z.literal("")),
  eventType: z.string().min(2),
  eventDate: z.string().min(4),
  startTime: z.string().optional().or(z.literal("")),
  venue: z.string().min(2),
  instruments: z.array(z.string()).min(1, "Pick at least one instrument"),
  hours: z.number().min(1).max(12),
  musicians: z.number().int().min(1).max(20),
  hourlyRate: z.number().min(1),
  travelMiles: z.number().min(0).max(500),
  equipmentFee: z.number().min(0).max(5000),
  notes: z.string().optional().or(z.literal(""))
});

export type GigRequestInput = z.infer<typeof gigRequestSchema>;

export const claimSchema = z.object({
  churchName: z.string().min(2),
  churchSlug: z.string().optional().or(z.literal("")),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  role: z.string().min(2),
  verificationMethod: z.enum(["DOMAIN_EMAIL", "PUBLIC_PHONE", "MANUAL_REVIEW"]),
  phone: z.string().optional(),
  evidence: z.string().min(10),
  message: z.string().min(10)
});
