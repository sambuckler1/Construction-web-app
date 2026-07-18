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

type AppointmentFormValues = {
  name: string;
  phone: string;
  email: string;
  address: string;
  dumpsterSize: string;
  date: string;
  notes: string;
};

type Status = "idle" | "submitting" | "success" | "error";

export function AppointmentForm() {
  const [status, setStatus] = useState<Status>("idle");

  const form = useForm<AppointmentFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      dumpsterSize: "",
      date: "",
      notes: "",
    },
  });

  async function onSubmit(values: AppointmentFormValues) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      form.reset();
    } catch (error) {
      console.error("Error submitting appointment:", error);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-16 text-center">
        <CheckCircle2 className="h-10 w-10 text-primary" />
        <h3 className="mt-5 font-display text-2xl font-semibold">
          Request received
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Thanks! We&apos;ll call or text to confirm availability, pricing, and
          your drop-off window.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-primary hover:underline"
        >
          Submit another request
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
          name="address"
          rules={{ required: "Drop-off address is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Drop-off Address</FormLabel>
              <FormControl>
                <Input placeholder="Street, city, ZIP" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="dumpsterSize"
            rules={{ required: "Please choose a size" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trailer Size</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="10-yard">
                      10 yard · Small cleanouts
                    </SelectItem>
                    <SelectItem value="15-yard">
                      15 yard · Remodel projects
                    </SelectItem>
                    <SelectItem value="20-yard">
                      20 yard · Construction &amp; large jobs
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            rules={{ required: "Preferred date is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Drop-off Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Details</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="What are you working on? Any access notes, tight driveways, overhead wires, etc."
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
            Something went wrong sending your request. Please try again or call
            us directly.
          </p>
        ) : null}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Request Dump Trailer"}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          No payment due yet. We&apos;ll confirm availability, pricing, and your
          drop-off window.
        </p>
      </form>
    </Form>
  );
}
