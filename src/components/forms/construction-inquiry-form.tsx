"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ConstructionFormValues = {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  timeline: string;
  budget: string;
  message: string;
};

type Status = "idle" | "submitting" | "success" | "error";

export function ConstructionInquiryForm() {
  const [status, setStatus] = useState<Status>("idle");

  const form = useForm<ConstructionFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      projectType: "",
      timeline: "",
      budget: "",
      message: "",
    },
  });

  async function onSubmit(values: ConstructionFormValues) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/construction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      form.reset();
    } catch (error) {
      console.error("Error submitting construction inquiry:", error);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-16 text-center">
        <CheckCircle2 className="h-10 w-10 text-primary" />
        <h3 className="mt-5 font-display text-2xl font-semibold">
          Inquiry received
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thanks for reaching out. We&apos;ll review your project and get back to
          you within 24–48 hours with a detailed quote and timeline.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-primary hover:underline"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            rules={{ required: "Phone is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Best number to reach you" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (optional)</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectType"
          rules={{ required: "Project type is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="custom-deck">Custom Deck Building</SelectItem>
                  <SelectItem value="deck-repair">
                    Deck Repair / Renovation
                  </SelectItem>
                  <SelectItem value="fence-installation">
                    Fence Installation
                  </SelectItem>
                  <SelectItem value="general-construction">
                    General Construction
                  </SelectItem>
                  <SelectItem value="consultation">
                    Consultation &amp; Design
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="timeline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timeline (optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="When do you need this?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="asap">ASAP</SelectItem>
                    <SelectItem value="1-2-months">1–2 months</SelectItem>
                    <SelectItem value="3-6-months">3–6 months</SelectItem>
                    <SelectItem value="6-plus-months">6+ months</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Range (optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="under-5k">Under $5,000</SelectItem>
                    <SelectItem value="5k-10k">$5,000 – $10,000</SelectItem>
                    <SelectItem value="10k-25k">$10,000 – $25,000</SelectItem>
                    <SelectItem value="25k-50k">$25,000 – $50,000</SelectItem>
                    <SelectItem value="50k-plus">$50,000+</SelectItem>
                    <SelectItem value="discuss">Prefer to discuss</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          rules={{ required: "Please describe your project" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Details</FormLabel>
              <FormControl>
                <Textarea
                  rows={6}
                  placeholder="Tell us about your project: size, materials, special requirements, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {status === "error" ? (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            Something went wrong sending your inquiry. Please try again or call us
            directly.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Submit Project Inquiry"}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          We&apos;ll review your inquiry and contact you within 24–48 hours.
        </p>
      </form>
    </Form>
  );
}
