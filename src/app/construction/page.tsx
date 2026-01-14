"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

type ConstructionFormValues = {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  timeline: string;
  budget: string;
  message: string;
};

export default function ConstructionPage() {
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
    try {
      const res = await fetch("/api/construction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      alert("Thanks! Your project inquiry has been sent. We'll contact you shortly.");
      form.reset();
    } catch (error) {
      console.error("Error submitting construction inquiry:", error);
      alert("Sorry, something went wrong sending your inquiry. Please try again or call/text.");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section - Static Image */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Static Hero Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/deck_images/hero2.png"
            alt="Custom deck construction"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            decoding="sync"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
        </div>

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
              Woodstock Renewal Contracting
            </motion.p>
            <motion.h1 
              className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl sm:leading-tight lg:text-6xl xl:text-7xl"
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              Custom Deck Building
              <motion.span 
                className="block bg-gradient-to-r from-teal-300 to-cyan-200 bg-clip-text text-transparent"
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              >
                & Construction Services
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
              Professional deck building, renovations, and construction services in Woodstock and surrounding areas. 
              Quality craftsmanship, transparent pricing, on-time completion.
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
                      .getElementById("inquiry")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Get a Quote
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Services Section */}
        <section className="mb-12 sm:mb-16 md:mb-20 pt-12 sm:pt-16">
          {/* Section Header */}
          <motion.div 
            className="mb-8 sm:mb-12 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Our Services
            </h2>
            <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground px-4">
              We specialize in premium, custom outdoor construction — especially decks — and we do it better than anyone else nearby.
            </p>
          </motion.div>

          {/* Featured Deck Specialties */}
          <motion.div
            className="mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Featured Deck Specialties</h3>
              <p className="text-sm text-muted-foreground">Premium materials and custom craftsmanship</p>
            </div>
            
            <div className="bg-neutral-950 rounded-2xl p-6 sm:p-8 border border-neutral-800">
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.08,
                    },
                  },
                }}
              >
                {[
                  { 
                    badge: "Premium Composite", 
                    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                    title: "Trex® & TimberTech® Decks", 
                    desc: "Low-maintenance, high-end composite decks built to last decades — custom designed for your space, not cookie-cutter layouts." 
                  },
                  { 
                    badge: "Craftsmanship", 
                    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
                    title: "Custom Board Designs", 
                    desc: "Picture framing, breaker boards, herringbone accents, and unique layouts that separate premium decks from average ones." 
                  },
                  { 
                    badge: "Modern Design", 
                    badgeColor: "bg-sky-500/20 text-sky-400 border-sky-500/30",
                    title: "Cable & Custom Rail Systems", 
                    desc: "Clean sightlines with stainless cable railings, aluminum systems, and custom installs tailored to your deck design." 
                  },
                  { 
                    badge: "Night Aesthetic", 
                    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
                    title: "Integrated Deck Lighting", 
                    desc: "Post caps, stair lighting, and under-rail LEDs for safety, ambiance, and serious nighttime presence." 
                  },
                  { 
                    badge: "Exotic Hardwoods", 
                    badgeColor: "bg-orange-700/20 text-orange-400 border-orange-700/30",
                    title: "Hardwood Decking", 
                    desc: "Ipe, Cumaru, and exotic hardwoods for unmatched durability and natural beauty that ages beautifully." 
                  },
                  { 
                    badge: "Value Builds", 
                    badgeColor: "bg-neutral-700/20 text-neutral-300 border-neutral-700/30",
                    title: "Pressure-Treated Builds", 
                    desc: "Pine, structural framing, and value builds that deliver quality construction at accessible price points." 
                  },
                ].map((specialty, idx) => (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <motion.div
                      whileHover={{ y: -6, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                      <Card className="bg-neutral-900 border-neutral-800 rounded-2xl min-h-[280px] flex flex-col hover:border-neutral-700 transition-all cursor-pointer shadow-lg hover:shadow-2xl">
                        <CardContent className="p-6 flex flex-col flex-1">
                          <div className="mb-4">
                            <Badge variant="outline" className={`${specialty.badgeColor} border`}>
                              {specialty.badge}
                            </Badge>
                          </div>
                          <h4 className="text-lg sm:text-xl font-bold text-neutral-100 mb-3">
                            {specialty.title}
                          </h4>
                          <p className="text-sm text-neutral-300 leading-relaxed flex-1 mb-4">
                            {specialty.desc}
                          </p>
                          <span className="text-xs text-teal-400 font-medium">View examples →</span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Trust Strip */}
              <motion.div
                className="mt-8 pt-6 border-t border-neutral-800"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-teal-500/10 text-teal-400 border-teal-500/30">
                      Trex Certified Installer
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-neutral-800/50 text-neutral-300 border-neutral-700">
                      Custom Built — No Prefab Kits
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-neutral-800/50 text-neutral-300 border-neutral-700">
                      Fully Insured & Local
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Divider */}
          <Separator className="my-8 sm:my-12" />

          {/* Other Services - Secondary Grid */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-muted-foreground">Other Services</h3>
            </div>
            <motion.div
              className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              {[
                { title: "Fence Installation", desc: "Privacy, security, and aesthetic fencing solutions" },
                { title: "General Construction", desc: "Home renovations, additions, and construction projects" },
                { title: "Consultation & Design", desc: "Expert advice and custom design services" },
                { title: "Maintenance & Repairs", desc: "Ongoing maintenance and repair services" },
              ].map((service, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Card className="border border-border/40 bg-card/50 shadow-sm">
                    <CardContent className="p-4 sm:p-5">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">{service.title}</h3>
                      <p className="mt-2 text-xs sm:text-sm text-muted-foreground">{service.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* CTA Block */}
          <motion.div
            className="mt-12 sm:mt-16 text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  className="rounded-full bg-teal-600 px-8 py-6 text-base font-semibold shadow-lg shadow-teal-900/50 transition-all hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-900/60"
                  onClick={() =>
                    document
                      .getElementById("inquiry")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Design Your Deck
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
                  className="rounded-full border-2 border-teal-600/50 px-8 py-6 text-base font-semibold hover:border-teal-600 hover:bg-teal-600/10"
                  onClick={() =>
                    document
                      .getElementById("gallery")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  See Past Builds
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Project Inquiry Form */}
        <section id="inquiry" className="mb-12 sm:mb-16 md:mb-20">
          <Card className="border-2 border-border/80 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl">Project Inquiry</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Tell us about your project and we&apos;ll provide a detailed quote and timeline.
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="custom-deck">Custom Deck Building</SelectItem>
                            <SelectItem value="deck-repair">Deck Repair/Renovation</SelectItem>
                            <SelectItem value="fence-installation">Fence Installation</SelectItem>
                            <SelectItem value="general-construction">General Construction</SelectItem>
                            <SelectItem value="consultation">Consultation & Design</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="timeline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timeline (optional)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="When do you need this?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="asap">ASAP</SelectItem>
                              <SelectItem value="1-2-months">1-2 months</SelectItem>
                              <SelectItem value="3-6-months">3-6 months</SelectItem>
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select budget range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="under-5k">Under $5,000</SelectItem>
                              <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                              <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                              <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
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
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full rounded-full bg-teal-600 font-semibold shadow-md transition-all hover:bg-teal-700 hover:shadow-lg"
                    >
                      Submit Project Inquiry
                    </Button>
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    We&apos;ll review your inquiry and contact you within 24-48 hours with a detailed quote.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>

        {/* Featured Projects Section */}
        <section id="gallery" className="mb-12 sm:mb-16 md:mb-20">
          <motion.div 
            className="mb-10 sm:mb-14 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Featured Projects
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground px-4 max-w-2xl mx-auto">
              A showcase of our craftsmanship — from hardwood decks to custom railings
            </p>
          </motion.div>
          
          <div className="space-y-16 sm:space-y-20">
            {[
              {
                image: "/deck_images/project1.jpeg",
                title: "Black Locust Hardwood Deck with Cable Rails",
                description: "The client's goal was a timeless, natural hardwood deck with clean sightlines and long-term durability. We built this deck using Black Locust hardwood paired with Cable Bullet cable railing for a seamless, modern look.",
                details: "Spanning over half a mile of decking, this project featured wide hardwood cocktail rails, minimalist cable splitters, integrated LED lighting, full picture framing, and a complete hidden fastener system—resulting in a refined, high-end finish that will age beautifully over time.",
              },
              {
                image: "/deck_images/project2.png",
                title: "Composite Deck Rebuild with Diagonal Board Design",
                description: "This homeowner wanted to completely replace a poorly installed composite deck and make the new space feel truly custom. Rather than replicating the original layout, we introduced a diagonal board pattern to highlight craftsmanship and elevate the overall design.",
                details: "Built with TimberTech composite decking, fully picture-framed, and paired with composite railings featuring black balusters for a nearly invisible look, this deck is entirely maintenance-free. Materials include TimberTech Coconut Husk decking, Trex composite railings, and Trex white PVC fascia.",
              },
              {
                image: "/deck_images/project3.JPG",
                title: "Trex Enhance Deck Upgrade with Modern Cable Rail",
                description: "With a solid existing frame in place, this project focused on upgrading the deck surface and railings for a fresh, modern look. We installed Trex Foggy Wharf decking from the Enhance Naturals line for a durable, low-maintenance finish.",
                details: "To complement the design, cable railing was installed through black-stained wood posts and capped with a Trex cocktail rail, preventing water damage while providing a functional and elegant top rail. Finished with Trex white PVC fascia throughout.",
              },
              {
                image: "/deck_images/project4.png",
                title: "Woodstock-Inspired Composite Deck with Wood Handrails",
                description: "The client wanted the low maintenance benefits of composite decking while preserving a classic Woodstock aesthetic. We achieved this balance by pairing Trex Enhance Naturals decking in Rocky Harbor with pressure-treated pine handrails and sleek cable railing.",
                details: "The result is a deck that feels warm and natural while maintaining clean lines and long-term durability, finished with Trex white PVC fascia for a polished look.",
              },
              {
                image: "/deck_images/project5.png",
                title: "Multi-Level Composite Deck with Pool Integration",
                description: "This large-scale rebuild included over 1,200 square feet of decking, two levels, three staircases, and precise cuts to accommodate an above-ground pool.",
                details: "Constructed with TimberTech Coconut Husk decking, cable railings stained to match the boards, and a TimberTech cocktail rail, this project required careful planning and execution. The finished deck offers durability, safety, and timeless style built to last for years.",
              },
              {
                image: "/deck_images/project6.png",
                title: "Hot Tub–Ready Elevated Composite Deck",
                description: "Designed to safely support a hot tub, this elevated deck required substantial structural framing and specialized equipment to position the tub atop the 8-foot-high, 350-square-foot platform.",
                details: "We used Trex Clam Shell decking paired with hog wire railings to deliver a low-maintenance solution that balances strength, safety, and visual appeal without sacrificing openness.",
              },
              {
                image: "/deck_images/project7.JPG",
                title: "Custom Interior Red Oak Staircase with Cable Rail",
                description: "This interior staircase was all about precision and detail. Built from red oak and finished with Cable Bullet cable railing, the staircase serves as both a functional structure and a design statement.",
                details: "The clean lines and quality materials transform a simple stairway into a welcoming architectural feature the homeowner enjoys every day.",
              },
              {
                image: "/deck_images/project8.png",
                title: "Modern Front Entrance with Aluminum Cable Rail",
                description: "The goal for this project was to create a clean, modern entrance that elevated the home's curb appeal. We replaced outdated columns with sleek black columns and installed aluminum Cable Bullet railings for a refined, contemporary look.",
                details: "The deck surface and fascia were completed with Trex Clam Shell decking and matching fascia, tying the entire entrance together with a cohesive, low-maintenance finish.",
              },
              {
                image: "/deck_images/project9.png",
                title: "Custom Cedar Fence with Automated Driveway Gate",
                description: "This custom fence was designed to provide security while maintaining an open, natural feel. Built from natural cedar logs with one-inch cedar rails and backed by discreet black netting, the fence allows the homeowner's dog to safely enjoy the front yard.",
                details: "An automated driveway gate completes the enclosure, offering peace of mind without compromising aesthetics.",
              },
              {
                image: "/deck_images/project10.png",
                title: "Front Porch Composite Replacement",
                description: "No project is too small to do right. This homeowner needed to replace a poorly installed wooden front porch originally built by their homebuilder.",
                details: "We removed the existing structure and installed a maintenance-free Trex Toasted Sand front porch, complete with Trex composite railings and Trex white PVC fascia. The result is a clean, durable, and professional finish that significantly improves both appearance and longevity.",
              },
            ].map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`flex flex-col gap-6 sm:gap-8 ${
                  idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Image */}
                <div className="lg:w-1/2 flex-shrink-0">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-border/40 shadow-lg group bg-neutral-900">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      loading={idx < 2 ? "eager" : "lazy"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="lg:w-1/2 flex flex-col justify-center">
                  <span className="text-teal-500 text-xs font-semibold uppercase tracking-widest mb-2">
                    Project {idx + 1}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <p className="text-muted-foreground/80 text-sm leading-relaxed">
                    {project.details}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mb-8 flex flex-col items-center justify-between gap-3 border-t-2 border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Woodstock Renewal Contracting. All rights reserved.</span>
          <span>Woodstock, GA · Licensed & Insured</span>
        </footer>
      </main>
    </div>
  );
}

