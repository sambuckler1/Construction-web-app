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
import { useState, Suspense, useRef, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, useProgress, Html } from "@react-three/drei";
import * as THREE from "three";

// Preload the model
useGLTF.preload("/models/goldfarb.glb");

type ConstructionFormValues = {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  timeline: string;
  budget: string;
  message: string;
};

// 3D Model Component
function DeckModel() {
  const { scene } = useGLTF("/models/goldfarb.glb");
  const modelRef = useRef<THREE.Group>(null);
  const pivotRef = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(1);

  // ============================================
  // ROTATION CENTER - Set these from SketchUp measurements
  // ============================================
  // In SketchUp, find your desired rotation point and measure:
  // - X: feet left/right from origin (positive = right, negative = left)
  // - Y: feet up/down from origin (positive = up, negative = down)  
  // - Z: feet forward/back from origin (positive = forward, negative = back)
  // ============================================
  const rotationCenter = useMemo(() => {
    return new THREE.Vector3(
      -126,  // X: Replace with your SketchUp X measurement (in feet) This is measurement left and right
      100,  // Y: Replace with your SketchUp Y measurement (in feet) up and down
      350   // Z: Replace with your SketchUp Z measurement (in feet) forward and back
    );
  }, []);

  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    // Calculate bounding box to determine proper scale
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Target size of about 6 units
    const targetSize = 6;
    const calculatedScale = targetSize / maxDim;
    setScale(calculatedScale);
    
    // Get the bounding box center
    const boxCenter = box.getCenter(new THREE.Vector3());
    
    // Offset the model so the rotation center aligns with origin
    // This makes the model rotate around your specified point
    const offset = boxCenter.clone().sub(rotationCenter);
    clone.position.sub(offset);
    
    // Traverse and ensure materials are visible
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          mat.side = THREE.DoubleSide;
          mat.needsUpdate = true;
        });
      }
    });
    
    return clone;
  }, [scene, rotationCenter]);

  useFrame((state) => {
    if (pivotRef.current) {
      // Oscillating rotation: 0 to 180 degrees and back
      // Adjust the 0.2 value to change speed (lower = slower)
      // Adjust the Math.PI multiplier to change range (Math.PI = 180 degrees)
      // Negative sign makes it start rotating counter-clockwise (negative direction)
      pivotRef.current.rotation.y = -Math.abs(Math.sin(state.clock.elapsedTime * 0.15)) * Math.PI;
    }
    if (modelRef.current) {
      // Subtle floating animation
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={pivotRef}>
      <group ref={modelRef} scale={scale} dispose={null}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

function ModelLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-teal-500 font-light tracking-widest text-sm">
        {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

export default function ConstructionPage() {
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());
  
  const toggleProject = (idx: number) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

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
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-4">
              What We Do
            </h2>
            <p className="max-w-3xl mx-auto text-base sm:text-lg text-foreground px-4 leading-relaxed">
              We design and build custom residential projects—from outdoor structures to full interior renovations—managing every phase from concept to completion.
            </p>
          </motion.div>

          {/* Service Categories */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              {[
                {
                  title: "Custom Deck & Outdoor Construction",
                  desc: "Thoughtfully built composite and hardwood decks, railings, stairs, and exterior structures.",
                },
                {
                  title: "Fence & Property Structures",
                  desc: "Custom fencing, gates, and site-built outdoor features.",
                },
                {
                  title: "Basement Refinishing & Interior Builds",
                  desc: "Full basement renovations, structural upgrades, and interior construction.",
                },
                {
                  title: "Ground-Up Project Management",
                  desc: "Design coordination, architecture, engineering, permitting, and full construction oversight.",
                },
              ].map((service, idx) => {
                // Add teal accent to key words
                const renderDescription = (text: string) => {
                  const words = text.split(' ');
                  return words.map((word, i) => {
                    const cleanWord = word.replace(/[.,]/g, '');
                    const punctuation = word.replace(cleanWord, '');
                    // Add teal accent to key premium words
                    const accentWords = ['Thoughtfully', 'Custom', 'Full', 'Design'];
                    if (accentWords.includes(cleanWord)) {
                      return (
                        <span key={i}>
                          <span style={{ color: '#14b8a6' }}>{cleanWord}</span>
                          {punctuation}
                          {i < words.length - 1 ? ' ' : ''}
                        </span>
                      );
                    }
                    return <span key={i}>{word}{i < words.length - 1 ? ' ' : ''}</span>;
                  });
                };
                
                return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card 
                    className="h-full transition-all duration-300 cursor-pointer"
                    style={{
                      backgroundColor: '#141414',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1A1A1A';
                      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#141414';
                      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.08)';
                    }}
                  >
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg sm:text-xl mb-2" style={{ color: '#ffffff' }}>
                        {service.title}
                      </h3>
                      <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#b5b5b5' }}>
                        {renderDescription(service.desc)}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                );
              })}
            </div>

            {/* Quiet line at bottom */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 sm:mt-10 text-center text-xs sm:text-sm text-muted-foreground/70 max-w-2xl mx-auto px-4"
            >
              We act as a single point of contact—coordinating design, engineering, permitting, and construction to deliver complete, well-executed projects.
            </motion.p>
          </motion.div>
        </section>

        {/* Design Before We Build - 3D Model Section */}
        <section className="mb-12 sm:mb-16 md:mb-20 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 sm:mb-12 text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl mb-3">
              Design Before We Build
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Explore how materials, layout, and details come together before construction begins.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Left: 3D Model */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative aspect-square rounded-xl overflow-hidden border-2 border-border/40 shadow-lg bg-neutral-900"
            >
              <Canvas
                camera={{ position: [0, 5, 10], fov: 40 }}
                shadows
                gl={{ antialias: true, alpha: true }}
              >
                <ambientLight intensity={0.6} />
                <directionalLight
                  position={[10, 15, 10]}
                  intensity={1}
                  castShadow
                  shadow-mapSize={2048}
                />
                <directionalLight position={[-10, 10, -10]} intensity={0.4} />
                <hemisphereLight args={["#ffffff", "#444444", 0.5]} />
                
                <Suspense fallback={<ModelLoader />}>
                  <DeckModel />
                </Suspense>
                
                <Environment preset="warehouse" environmentIntensity={0.4} />
              </Canvas>
            </motion.div>

            {/* Right: Copy */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="space-y-6"
            >
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                Every deck we build starts with thoughtful planning. Our design process allows clients to visualize layout, materials, railings, and elevations before construction begins—ensuring clarity, confidence, and a better final result.
              </p>
              
              <ul className="space-y-3">
                {[
                  "Board orientation & spacing",
                  "Railing and stair options",
                  "Elevation and structural layout",
                  "Material combinations",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-teal-500 mt-1">•</span>
                    <span className="text-muted-foreground text-sm sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  className="rounded-full bg-teal-600 px-8 py-6 text-base font-semibold shadow-lg shadow-teal-900/50 transition-all hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-900/60 w-full sm:w-auto"
                  onClick={() =>
                    document
                      .getElementById("inquiry")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Design Your Deck
                </Button>
              </motion.div>
            </motion.div>
          </div>
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
          
          <div className="space-y-8 sm:space-y-16 md:space-y-20">
            {[
              {
                image: "/deck_images/project1.jpeg",
                location: "Woodstock, NY",
                title: "Black Locust Hardwood Deck with Cable Rails",
                description: "The client's goal was a timeless, natural hardwood deck with clean sightlines and long-term durability. We built this deck using Black Locust hardwood paired with Cable Bullet cable railing for a seamless, modern look.",
                details: "Spanning over half a mile of decking, this project featured wide hardwood cocktail rails, minimalist cable splitters, integrated LED lighting, full picture framing, and a complete hidden fastener system—resulting in a refined, high-end finish that will age beautifully over time.",
              },
              {
                image: "/deck_images/project2.png",
                location: "Kingston, NY",
                title: "Composite Deck Rebuild with Diagonal Board Design",
                description: "This homeowner wanted to completely replace a poorly installed composite deck and make the new space feel truly custom. Rather than replicating the original layout, we introduced a diagonal board pattern to highlight craftsmanship and elevate the overall design.",
                details: "Built with TimberTech composite decking, fully picture-framed, and paired with composite railings featuring black balusters for a nearly invisible look, this deck is entirely maintenance-free. Materials include TimberTech Coconut Husk decking, Trex composite railings, and Trex white PVC fascia.",
              },
              {
                image: "/deck_images/project3.JPG",
                location: "Woodstock, NY",
                title: "Trex Enhance Deck Upgrade with Modern Cable Rail",
                description: "With a solid existing frame in place, this project focused on upgrading the deck surface and railings for a fresh, modern look. We installed Trex Foggy Wharf decking from the Enhance Naturals line for a durable, low-maintenance finish.",
                details: "To complement the design, cable railing was installed through black-stained wood posts and capped with a Trex cocktail rail, preventing water damage while providing a functional and elegant top rail. Finished with Trex white PVC fascia throughout.",
              },
              {
                image: "/deck_images/project4.png",
                location: "Woodstock, NY",
                title: "Woodstock-Inspired Composite Deck with Wood Handrails",
                description: "The client wanted the low maintenance benefits of composite decking while preserving a classic Woodstock aesthetic. We achieved this balance by pairing Trex Enhance Naturals decking in Rocky Harbor with pressure-treated pine handrails and sleek cable railing.",
                details: "The result is a deck that feels warm and natural while maintaining clean lines and long-term durability, finished with Trex white PVC fascia for a polished look.",
              },
              {
                image: "/deck_images/project5.png",
                location: "Woodstock, NY",
                title: "Multi-Level Composite Deck with Pool Integration",
                description: "This large-scale rebuild included over 1,200 square feet of decking, two levels, three staircases, and precise cuts to accommodate an above-ground pool.",
                details: "Constructed with TimberTech Coconut Husk decking, cable railings stained to match the boards, and a TimberTech cocktail rail, this project required careful planning and execution. The finished deck offers durability, safety, and timeless style built to last for years.",
              },
              {
                image: "/deck_images/project6.png",
                location: "Kingston, NY",
                title: "Hot Tub–Ready Elevated Composite Deck",
                description: "Designed to safely support a hot tub, this elevated deck required substantial structural framing and specialized equipment to position the tub atop the 8-foot-high, 350-square-foot platform.",
                details: "We used Trex Clam Shell decking paired with hog wire railings to deliver a low-maintenance solution that balances strength, safety, and visual appeal without sacrificing openness.",
              },
              {
                image: "/deck_images/project7.JPG",
                location: "Kingston, NY",
                title: "Custom Interior Red Oak Staircase with Cable Rail",
                description: "This interior staircase was all about precision and detail. Built from red oak and finished with Cable Bullet cable railing, the staircase serves as both a functional structure and a design statement.",
                details: "The clean lines and quality materials transform a simple stairway into a welcoming architectural feature the homeowner enjoys every day.",
              },
              {
                image: "/deck_images/project8.png",
                location: "Kingston, NY",
                title: "Modern Front Entrance with Aluminum Cable Rail",
                description: "The goal for this project was to create a clean, modern entrance that elevated the home's curb appeal. We replaced outdated columns with sleek black columns and installed aluminum Cable Bullet railings for a refined, contemporary look.",
                details: "The deck surface and fascia were completed with Trex Clam Shell decking and matching fascia, tying the entire entrance together with a cohesive, low-maintenance finish.",
              },
              {
                image: "/deck_images/project9.png",
                location: "Woodstock, NY",
                title: "Custom Cedar Fence with Automated Driveway Gate",
                description: "This custom fence was designed to provide security while maintaining an open, natural feel. Built from natural cedar logs with one-inch cedar rails and backed by discreet black netting, the fence allows the homeowner's dog to safely enjoy the front yard.",
                details: "An automated driveway gate completes the enclosure, offering peace of mind without compromising aesthetics.",
              },
              {
                image: "/deck_images/project10.png",
                location: "Newburgh, NY",
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
                className={`flex flex-col gap-4 sm:gap-6 md:gap-8 ${
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
                    {project.location}
                  </span>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground flex-1">
                      {project.title}
                    </h3>
                    {/* Mobile expand/collapse button */}
                    <button
                      onClick={() => toggleProject(idx)}
                      className="lg:hidden flex-shrink-0 p-1 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={expandedProjects.has(idx) ? "Collapse details" : "Expand details"}
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          expandedProjects.has(idx) ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {/* Desktop: always show, Mobile: show only when expanded */}
                  <div className={`lg:block ${expandedProjects.has(idx) ? "block" : "hidden"}`}>
                    <p className="text-muted-foreground leading-relaxed mb-4 text-sm sm:text-base">
                      {project.description}
                    </p>
                    <p className="text-muted-foreground/80 text-xs sm:text-sm leading-relaxed">
                      {project.details}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center space-y-6"
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Like what you see?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Get in touch and let's bring your project to life.
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
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
                Get a Quote
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="mb-8 flex flex-col items-center justify-between gap-3 border-t-2 border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Woodstock Renewal Contracting. All rights reserved.</span>
          <span>Woodstock, NY · Licensed & Insured</span>
        </footer>
      </main>
    </div>
  );
}

