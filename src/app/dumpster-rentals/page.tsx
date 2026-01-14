"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

type AppointmentFormValues = {
  name: string;
  phone: string;
  email: string;
  address: string;
  dumpsterSize: string;
  date: string;
  notes: string;
};

type ContactFormValues = {
  name: string;
  phone: string;
  message: string;
};

export default function DumpsterRentalsPage() {
  const appointmentForm = useForm<AppointmentFormValues>({
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

  const contactForm = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      message: "",
    },
  });

  async function onSubmitAppointment(values: AppointmentFormValues) {
    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      alert("Thanks! Your dumpster appointment request has been emailed.");
      appointmentForm.reset();
    } catch (error) {
      console.error("Error submitting appointment:", error);
      alert("Sorry, something went wrong sending your request. Please try again or call/text.");
    }
  }

  async function onSubmitContact(values: ContactFormValues) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      alert("Thanks for reaching out! Your message has been emailed to the owner.");
      contactForm.reset();
    } catch (error) {
      console.error("Error submitting contact message:", error);
      alert("Sorry, something went wrong sending your message. Please try again or call/text.");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background Image */}
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="relative h-full w-full">
            <Image
              src="/IMG_9800.jpg"
              alt="Dump trailer on job site"
              fill
              className="object-cover object-center"
              unoptimized
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {/* Animated Hero Content */}
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12">
          <motion.div 
            className="max-w-3xl space-y-4 sm:space-y-6 text-white"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.3,
                },
              },
            }}
          >
            <motion.p 
              className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-teal-300"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Local Dump Trailer Rental
            </motion.p>
            <motion.h1 
              className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl sm:leading-tight lg:text-6xl xl:text-7xl"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              On-Time Delivery & Pickup
              <motion.span 
                className="block bg-gradient-to-r from-teal-300 to-emerald-500 bg-clip-text text-transparent"
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              >
                No Job Delays
              </motion.span>
            </motion.h1>
            <motion.p 
              className="max-w-2xl text-base leading-relaxed text-gray-100 sm:text-lg sm:leading-relaxed md:text-xl"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Driveway-safe dump trailers for contractors and homeowners. 
              Same-week availability, transparent pricing, zero surprises.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-teal-600 px-6 py-5 text-sm sm:text-base font-semibold shadow-lg shadow-teal-900/50 transition-all hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-900/60 sm:px-8 sm:py-6"
                  onClick={() =>
                    document
                      .getElementById("schedule")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Schedule a Dump Trailer
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-full border-2 border-white/80 bg-white/10 px-6 py-5 text-sm sm:text-base font-semibold backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white sm:px-8 sm:py-6"
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Contact the Owner
                </Button>
              </motion.div>
            </motion.div>
            <motion.div 
              className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 md:gap-6 pt-2 sm:pt-4 text-xs sm:text-sm font-medium text-gray-200"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-300" />
                Same-week availability
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-300" />
                Driveway-safe equipment
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-teal-300" />
                Licensed & insured
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Social Proof Banner */}
        <section className="relative -mt-12 sm:-mt-16 z-20 mb-12 sm:mb-16">
          <Card className="border-2 border-teal-200/60 bg-gradient-to-r from-teal-50 to-emerald-100/50 shadow-xl dark:border-teal-900/40 dark:from-teal-950/50 dark:to-emerald-950/30">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">
                    Trusted by Local Contractors & Homeowners
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Serving Woodstock and surrounding areas since 2025
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-foreground">
                  <div>
                    <div className="text-2xl font-bold text-teal-700 dark:text-teal-400">100%</div>
                    <div className="text-xs text-muted-foreground">On-Time Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-teal-700 dark:text-teal-400">0</div>
                    <div className="text-xs text-muted-foreground">Surprise Fees</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Common Projects Section */}
        <section className="mb-12 sm:mb-16 md:mb-20">
          <motion.div 
            className="mb-6 sm:mb-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Common Projects We Handle
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground px-4">
              Driveway-safe drop-off & pickup for cleanouts and demolition debris
            </p>
          </motion.div>
          <motion.div 
            className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {[
              { title: "Home & Estate Cleanouts", desc: "Furniture, household junk, storage cleanouts" },
              { title: "Renovation & Demolition Debris", desc: "Drywall, lumber, fixtures, flooring" },
              { title: "Contractor Job Sites", desc: "Remodels, tear-outs, ongoing projects" },
              { title: "Garage, Basement & Attic Cleanouts", desc: "Bulk waste, old materials, clutter" },
            ].map((job, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Card className="border border-border/80 bg-card shadow-sm transition-all hover:shadow-md">
                  <CardContent className="p-4 sm:p-5">
                    <h3 className="font-semibold text-foreground">{job.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{job.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Why Dump Trailer vs Roll-Off Section */}
        <section className="mb-12 sm:mb-16 md:mb-20 rounded-2xl bg-muted/60 p-6 sm:p-8 md:p-12">
          <motion.div 
            className="mb-6 sm:mb-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Why Choose a Dump Trailer Instead of a Roll-Off?
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground px-4">
              Better access, faster service, less damage
            </p>
          </motion.div>
          <motion.div 
            className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {[
              { 
                title: "Easier Driveway Access", 
                desc: "Lower profile fits tight spaces and steep driveways that roll-offs can't reach." 
              },
              { 
                title: "Lower Height for Hand Loading", 
                desc: "No climbing required. Load directly from ground level or small steps." 
              },
              { 
                title: "Faster Drop-Off & Pickup", 
                desc: "Quick hydraulic dump means less time blocking your driveway or job site." 
              },
              { 
                title: "Less Surface Damage", 
                desc: "Lighter weight distribution protects driveways and asphalt better than roll-offs." 
              },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <Card className="border-2 border-teal-200/40 bg-background shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-teal-700 dark:text-teal-400">
                      {benefit.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Schedule Appointment Section */}
        <section id="schedule" className="mb-12 sm:mb-16 md:mb-20 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
          <Card className="border-2 border-border/80 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Schedule a Dump Trailer</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                On-time delivery and pickup — no job delays. Tell us what you need and we&apos;ll confirm details and pricing.
              </p>
            </CardHeader>
            <CardContent>
              <Form {...appointmentForm}>
                <form
                  onSubmit={appointmentForm.handleSubmit(onSubmitAppointment)}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={appointmentForm.control}
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
                      control={appointmentForm.control}
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
                    control={appointmentForm.control}
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
                    control={appointmentForm.control}
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
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={appointmentForm.control}
                      name="dumpsterSize"
                      rules={{ required: "Please choose a size" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trailer Size</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="10-yard">10 yard · Small cleanouts</SelectItem>
                              <SelectItem value="15-yard">15 yard · Remodel projects</SelectItem>
                              <SelectItem value="20-yard">20 yard · Construction & large jobs</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={appointmentForm.control}
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
                    control={appointmentForm.control}
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
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full rounded-full bg-teal-600 font-semibold shadow-md transition-all hover:bg-teal-700 hover:shadow-lg"
                    >
                      Request Dump Trailer
                    </Button>
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    No payment due yet. We&apos;ll call or text to confirm availability, pricing, and your drop-off window.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Key info sidebar */}
          <div className="space-y-6">
            <Card className="border-2 border-dashed border-teal-200/60 bg-teal-50/40 shadow-sm dark:border-teal-900/40 dark:bg-teal-950/30">
              <CardHeader>
                <CardTitle className="text-base">How it works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">1.</span> Send your request with the form.
                </p>
                <p>
                  <span className="font-semibold text-foreground">2.</span> We&apos;ll call or text you to confirm the time, price, and placement.
                </p>
                <p>
                  <span className="font-semibold text-foreground">3.</span> We drop the trailer, you fill it, and we pick it up—no hassle, no delays.
                </p>
                <p className="pt-2 text-xs">
                  Need something sooner than the date picker shows? Use the contact form or call directly and we&apos;ll see what we can do.
                </p>
              </CardContent>
            </Card>

            {/* Image Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-border/60">
                <Image
                  src="/IMG_9801 2.jpg"
                  alt="Dump trailer on job site"
                  fill
                  className="object-cover"
                  unoptimized
                  loading="lazy"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-border/60">
                <Image
                  src="/IMG_9802 2.jpg"
                  alt="Dump trailer equipment"
                  fill
                  className="object-cover"
                  unoptimized
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Owner Section */}
        <section id="contact" className="mb-12 sm:mb-16 md:mb-20 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
          <Card className="border-2 border-border/80 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Contact the Owner</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Questions about pricing, materials, timelines, or job sites? Reach out directly.
              </p>
            </CardHeader>
            <CardContent>
              <Form {...contactForm}>
                <form
                  onSubmit={contactForm.handleSubmit(onSubmitContact)}
                  className="space-y-4"
                >
                  <FormField
                    control={contactForm.control}
                    name="name"
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contactForm.control}
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
                  <FormField
                    control={contactForm.control}
                    name="message"
                    rules={{ required: "Please add a quick message" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Ask about pricing, materials, timelines, or anything else."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full rounded-full bg-teal-600 font-semibold shadow-md transition-all hover:bg-teal-700 hover:shadow-lg"
                    >
                      Send Message
                    </Button>
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    Prefer a call? Dial{" "}
                    <span className="font-semibold text-foreground">(555) 123‑4567</span>.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="border-2 border-border/80 bg-background/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Why local contractors choose us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <span className="font-semibold text-teal-600 dark:text-teal-400">•</span>
                <span>On-time drop-offs and pickups that keep your jobs moving—no delays, no excuses.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-semibold text-teal-600 dark:text-teal-400">•</span>
                <span>Clear communication, no surprise fees, and flexible scheduling that works around your timeline.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="font-semibold text-teal-600 dark:text-teal-400">•</span>
                <span>Respect for your property and your clients&apos; driveways—we know what matters on the job site.</span>
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Service Area & Hours Card */}
        <section className="mb-12 sm:mb-16 md:mb-20">
          <Card className="border-2 border-teal-200/60 bg-gradient-to-br from-teal-50 to-emerald-50/50 shadow-lg dark:border-teal-900/40 dark:from-teal-950/50 dark:to-teal-900/30">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Service Area & Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="font-semibold text-foreground">Woodstock & surrounding areas</p>
              <p className="text-muted-foreground">Mon–Sat · 7:00am – 6:00pm</p>
              <p className="text-muted-foreground">
                Call or text: <span className="font-semibold text-teal-700 dark:text-teal-400">(555) 123‑4567</span>
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="mb-8 flex flex-col items-center justify-between gap-3 border-t-2 border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Woodstock Dumpster Rentals. All rights reserved.</span>
          <span>Woodstock, NY · Licensed & Insured</span>
        </footer>
      </main>
    </div>
  );
}

