"use client";

import Image from "next/image";
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
import { useState, useEffect } from "react";
import * as React from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Carousel } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ConstructionFormValues = {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  timeline: string;
  budget: string;
  message: string;
};

// Helper function to get optimized Cloudinary URL - MUST use f_auto, q_auto, explicit width
function getCloudinaryUrl(publicId: string, forThumbnail: boolean = true, useTrim: boolean = true): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return "";
  
  const trimEffect = useTrim ? "e_trim:auto," : "";
  
  if (forThumbnail) {
    // CRITICAL: f_auto (WebP/AVIF), q_auto (smart compression), w_400 (reduced from 800px for faster loading)
    return `https://res.cloudinary.com/${cloudName}/image/upload/${trimEffect}f_auto,q_auto,w_400,c_fill,g_auto/${publicId}`;
  } else {
    // Full-size modal: f_auto, q_auto, max width 1920px
    return `https://res.cloudinary.com/${cloudName}/image/upload/${trimEffect}f_auto,q_auto,c_limit,w_1920,g_auto/${publicId}`;
  }
}

// Get blurred placeholder (LQIP) for instant perceived loading
function getCloudinaryBlurUrl(publicId: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return "";
  // Tiny blurred image: 50px width, heavy blur, low quality - loads instantly
  return `https://res.cloudinary.com/${cloudName}/image/upload/e_blur:200,q_10,w_50/${publicId}`;
}

// Optimized Image Card Component - follows all performance rules
function GalleryImageCard({
  img,
  isFirstRow,
  onImageClick,
}: {
  img: {
    id: string;
    src: string;
    fullSrc: string;
    alt: string;
    isCloudinary: boolean;
    publicId?: string;
    localFallback?: string;
  };
  isFirstRow: boolean;
  onImageClick: (fullSrc: string, layoutId: string) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div
      className="relative aspect-square overflow-hidden rounded-lg border-2 border-border/60 cursor-pointer hover:border-teal-400 transition-colors bg-black/5"
      onClick={() => onImageClick(img.fullSrc, img.id)}
    >
      {img.isCloudinary && img.publicId ? (
        <>
          {/* Blurred placeholder (LQIP) - loads instantly */}
          <img
            src={getCloudinaryBlurUrl(img.publicId)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl"
            aria-hidden="true"
            loading="eager"
            decoding="async"
            width={400}
            height={400}
          />
          {/* Full image - fades in after load */}
          <img
            src={img.src}
            alt={img.alt}
            width={400}
            height={400}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading={isFirstRow ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={isFirstRow ? "high" : "low"}
            onLoad={() => {
              // Use requestIdleCallback to avoid blocking main thread
              if ('requestIdleCallback' in window) {
                requestIdleCallback(() => setLoaded(true), { timeout: 100 });
              } else {
                setTimeout(() => setLoaded(true), 0);
              }
            }}
            onError={(e) => {
              const target = e.currentTarget;
              console.error(`❌ Failed to load Cloudinary image: ${img.src}`);
              
              if (img.localFallback) {
                target.src = `/${img.localFallback}`;
                target.onerror = () => {
                  target.style.display = 'none';
                };
                return;
              }
              
              target.style.display = 'none';
            }}
          />
        </>
      ) : (
        <img
          src={img.src}
          alt={img.alt}
          width={400}
          height={400}
          className="absolute inset-0 w-full h-full object-cover"
          loading={isFirstRow ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={isFirstRow ? "high" : "low"}
          onError={(e) => {
            console.error(`❌ Failed to load local image: ${img.src}`);
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
    </div>
  );
}

// Hero images for slideshow - using Cloudinary public IDs
const heroImageIds = [
  "woodstock-renewal/hero1",
  "woodstock-renewal/hero2",
  "woodstock-renewal/hero3",
  "woodstock-renewal/hero4",
  "woodstock-renewal/hero5",
];

// Helper function to get hero image URL from Cloudinary
function getHeroImageUrl(publicId: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    // Fallback to local path if Cloudinary not configured
    const localPath = publicId.replace('woodstock-renewal/', 'deck_images/');
    if (localPath.includes('hero4') || localPath.includes('hero5')) {
      return `/${localPath}.JPG`;
    }
    return `/${localPath}.png`;
  }
  // Optimized hero image: WebP format, quality 80, max width 1920px for faster loading
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_webp,q_80,c_limit,w_1920/${publicId}`;
}

// Fallback local images (used if Cloudinary fails or images are missing)
// Excludes hero images and fence images - only deck project photos
const fallbackLocalImages = [
  "deck_images/deckGoldfarb.png",
  "deck_images/IMG_4484.jpeg",
  "deck_images/IMG_4485.jpeg",
  "deck_images/IMG_4487.jpeg",
  "deck_images/IMG_4488.jpeg",
  "deck_images/IMG_4489.jpeg",
  "deck_images/IMG_4490.jpeg",
  "deck_images/IMG_6227 2.jpeg",
  "deck_images/IMG_6228 2.jpeg",
  "deck_images/IMG_6229 3.jpeg",
  "deck_images/IMG_6230 3.jpeg",
  "deck_images/IMG_6231 3.jpeg",
  "deck_images/IMG_6232 2.jpeg",
  "deck_images/IMG_6233 2.jpeg",
  "deck_images/IMG_6234 2.jpeg",
  "deck_images/IMG_6234.jpeg",
  "deck_images/IMG_6235 2.jpeg",
  "deck_images/IMG_6236 2.jpeg",
  "deck_images/IMG_6237 2.jpeg",
  "deck_images/IMG_6238 2.jpeg",
  "deck_images/IMG_6239 2.jpeg",
  "deck_images/IMG_6240 2.jpeg",
  "deck_images/IMG_6262 2.jpeg",
  "deck_images/IMG_6263 2.jpeg",
  "deck_images/IMG_6264 2.jpeg",
  "deck_images/IMG_6265 2.jpeg",
  "deck_images/IMG_6266 2.jpeg",
  "deck_images/IMG_6267 2.jpeg",
  "deck_images/IMG_6268 2.jpeg",
  "deck_images/image000000.JPG",
  "deck_images/image000002.JPG",
  "deck_images/image000004.JPG",
  "deck_images/IMG_8398.JPG",
  "deck_images/IMG_8530.png",
  "deck_images/IMG_8533.png",
  "deck_images/IMG_8559.png",
  "deck_images/IMG_8582.png",
  "deck_images/IMG_8587.png",
  "deck_images/IMG_8701.png",
  "deck_images/IMG_8709.png",
  "deck_images/IMG_8821.png",
  "deck_images/IMG_8846.png",
  "deck_images/IMG_8848.png",
  "deck_images/IMG_8854.png",
  "deck_images/IMG_8965.png",
  "deck_images/IMG_8967.png",
];

type CloudinaryImage = {
  publicId: string;
  url: string;
  format?: string;
  width?: number;
  height?: number;
};

export default function ConstructionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [cloudinaryImages, setCloudinaryImages] = useState<CloudinaryImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [usingCloudinary, setUsingCloudinary] = useState(false);
  const [galleryPage, setGalleryPage] = useState(0); // Current page in 2x2 slideshow
  
  // Preload ONLY current page images (4 max) - no aggressive preloading
  React.useEffect(() => {
    if (loadingImages || (!usingCloudinary && cloudinaryImages.length === 0)) return;
    
    // Get current page images only
    let allImages: Array<{ src: string }> = [];
    if (usingCloudinary && cloudinaryImages.length > 0) {
      allImages = cloudinaryImages
        .filter((img) => {
          const publicId = img.publicId.toLowerCase();
          return !publicId.includes('hero') && !publicId.includes('fence');
        })
        .map((img) => ({
          src: getCloudinaryUrl(img.publicId, true),
        }));
    } else {
      allImages = fallbackLocalImages
        .filter((path) => {
          const p = path.toLowerCase();
          return !p.includes('hero') && !p.includes('fence');
        })
        .map((path) => ({
          src: `/${path}`,
        }));
    }
    
    const imagesPerPage = 4;
    const currentPageImages = allImages.slice(
      galleryPage * imagesPerPage,
      (galleryPage + 1) * imagesPerPage
    );
    
    // Preload ONLY current page (4 images max) - no double preloading
    currentPageImages.forEach((img) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.src;
      if (!document.querySelector(`link[href="${img.src}"]`)) {
        document.head.appendChild(link);
      }
    });
  }, [galleryPage, loadingImages, usingCloudinary, cloudinaryImages]);

  // Removed hero image preloading - let them load naturally to avoid blocking
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

  // Fetch images from Cloudinary on component mount
  useEffect(() => {
    async function fetchCloudinaryImages() {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        console.log("ℹ️ Cloudinary not configured, using local images");
        setLoadingImages(false);
        return;
      }

      try {
        const response = await fetch("/api/list-cloudinary-images");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();

        if (data.success && data.images && data.images.length > 0) {
          // Filter out hero and fence images from Cloudinary list
          const filteredImages = data.images.filter((img: CloudinaryImage) => {
            const publicId = img.publicId.toLowerCase();
            return !publicId.includes('hero') && !publicId.includes('fence');
          });
          setCloudinaryImages(filteredImages);
          setUsingCloudinary(true);
          console.log(`✅ Loaded ${data.images.length} total images from Cloudinary, ${filteredImages.length} after filtering (excluding hero/fence)`);
          
          // Preload first 6 gallery images for instant display
          filteredImages.slice(0, 6).forEach((img: CloudinaryImage) => {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = getCloudinaryUrl(img.publicId, true);
            document.head.appendChild(preloadLink);
            
            // Also preload in browser cache
            const imgElement = new window.Image();
            imgElement.src = getCloudinaryUrl(img.publicId, true);
          });
        } else {
          console.log("ℹ️ No images found in Cloudinary, using local fallback");
        }
      } catch (error) {
        console.error("❌ Failed to fetch Cloudinary images:", error);
        // Fall back to local images on error
      } finally {
        setLoadingImages(false);
      }
    }

    fetchCloudinaryImages();
  }, []);

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
      {/* Hero Section with Carousel */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Carousel Background Images */}
        <div className="absolute inset-0 z-0">
          {heroImageIds.length > 0 ? (
            <Carousel autoPlay={true} interval={6000} className="h-full w-full">
              {heroImageIds.map((publicId, idx) => {
                const imageUrl = getHeroImageUrl(publicId);
                return (
                  <div key={`hero-${idx}-${publicId}`} className="relative w-full h-full" style={{ minHeight: '100vh', width: '100%' }}>
                    <img
                      src={imageUrl}
                      alt={`Custom deck construction ${idx + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ 
                        minHeight: '100%', 
                        minWidth: '100%',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      loading="eager"
                      decoding="sync"
                      onLoad={(e) => {
                        console.log(`✅ Hero image ${idx + 1} loaded successfully from Cloudinary`);
                      }}
                      onError={(e) => {
                        console.error(`❌ Failed to load hero image ${idx + 1} from Cloudinary: ${imageUrl}`);
                        // Try fallback for first image only
                        if (idx === 0 && !e.currentTarget.src.includes('deckGoldfarb')) {
                          console.log('Trying fallback image...');
                          e.currentTarget.src = '/deck_images/deckGoldfarb.png';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
                  </div>
                );
              })}
            </Carousel>
          ) : (
            <div className="relative w-full h-full">
              <img
                src="/deck_images/deckGoldfarb.png"
                alt="Custom deck construction"
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
            </div>
          )}
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

        {/* Gallery Section */}
        <section id="gallery" className="mb-12 sm:mb-16 md:mb-20">
          <motion.div 
            className="mb-6 sm:mb-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Our Work
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground px-4">
              Recent deck building and construction projects
            </p>
          </motion.div>
          
          {loadingImages ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading images...</p>
            </div>
          ) : (
            <div className="relative">
              {/* 2x2 Grid Slideshow */}
              {(() => {
                // Determine which images to show
                let allImages: Array<{
                  id: string;
                  src: string;
                  fullSrc: string;
                  alt: string;
                  layoutId: string;
                  isCloudinary: boolean;
                  publicId?: string;
                  localFallback?: string;
                }> = [];

                if (usingCloudinary && cloudinaryImages.length > 0) {
                  // Use Cloudinary images, filtering out hero and fence images
                  allImages = cloudinaryImages
                    .filter((img) => {
                      const publicId = img.publicId.toLowerCase();
                      return !publicId.includes('hero') && !publicId.includes('fence');
                    })
                    .map((img, idx) => {
                      // Find local fallback path for this Cloudinary image
                      const cloudinaryName = img.publicId.replace('woodstock-renewal/', '').toLowerCase();
                      const localFallback = fallbackLocalImages.find((localPath) => {
                        const localName = localPath.replace('deck_images/', '').replace(/\.(jpeg|jpg|png|JPG|PNG)$/i, '').toLowerCase();
                        return localName === cloudinaryName;
                      });

                      return {
                        id: `cloudinary-${img.publicId}`,
                        src: getCloudinaryUrl(img.publicId, true),
                        fullSrc: getCloudinaryUrl(img.publicId, false),
                        alt: `Construction project ${idx + 1}`,
                        layoutId: `image-cloudinary-${img.publicId}`,
                        isCloudinary: true,
                        publicId: img.publicId,
                        localFallback: localFallback,
                      };
                    });
                } else {
                  // Fall back to local images, filtering out hero and fence images
                  allImages = fallbackLocalImages
                    .filter((imagePath) => {
                      const path = imagePath.toLowerCase();
                      return !path.includes('hero') && !path.includes('fence');
                    })
                    .map((imagePath, idx) => ({
                      id: `local-${idx}-${imagePath}`,
                      src: `/${imagePath}`,
                      fullSrc: `/${imagePath}`,
                      alt: `Construction project ${idx + 1}`,
                      layoutId: `image-local-${idx}`,
                      isCloudinary: false,
                    }));
                }

                // Chunk images into groups of 4
                const imagesPerPage = 4;
                const totalPages = Math.ceil(allImages.length / imagesPerPage);
                const currentPageImages = allImages.slice(
                  galleryPage * imagesPerPage,
                  (galleryPage + 1) * imagesPerPage
                );

                return (
                  <div className="relative">
                    {/* Simplified grid - no Framer Motion animations to reduce overhead */}
                    <div
                      className="grid grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto"
                      onTouchStart={(e) => {
                        const touch = e.touches[0];
                        const startX = touch.clientX;
                        const startY = touch.clientY;
                        
                        const handleTouchEnd = (e: TouchEvent) => {
                          const touch = e.changedTouches[0];
                          const endX = touch.clientX;
                          const endY = touch.clientY;
                          const diffX = startX - endX;
                          const diffY = startY - endY;
                          
                          // Only trigger if horizontal swipe is greater than vertical
                          if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                            if (diffX > 0 && galleryPage < totalPages - 1) {
                              setGalleryPage(galleryPage + 1);
                            } else if (diffX < 0 && galleryPage > 0) {
                              setGalleryPage(galleryPage - 1);
                            }
                          }
                          
                          document.removeEventListener('touchend', handleTouchEnd);
                        };
                        
                        document.addEventListener('touchend', handleTouchEnd, { once: true });
                      }}
                    >
                      {currentPageImages.map((img, idx) => {
                        const isFirstPage = galleryPage === 0;
                        const isFirstRow = isFirstPage && idx < 2;
                        
                        return (
                          <GalleryImageCard
                            key={`${galleryPage}-${img.id}`}
                            img={img}
                            isFirstRow={isFirstRow}
                            onImageClick={(fullSrc, layoutId) => {
                              setSelectedImage(fullSrc);
                              setSelectedImageId(layoutId);
                            }}
                          />
                        );
                      })}
                    </div>

                    {/* Navigation Buttons */}
                    {totalPages > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 h-10 w-10 rounded-full bg-background/80 hover:bg-background border border-border shadow-lg z-10 transition-opacity"
                          onClick={() => {
                            if (galleryPage > 0) {
                              setGalleryPage(galleryPage - 1);
                            }
                          }}
                          disabled={galleryPage === 0}
                          aria-label="Previous images"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 h-10 w-10 rounded-full bg-background/80 hover:bg-background border border-border shadow-lg z-10 transition-opacity"
                          onClick={() => {
                            if (galleryPage < totalPages - 1) {
                              setGalleryPage(galleryPage + 1);
                            }
                          }}
                          disabled={galleryPage === totalPages - 1}
                          aria-label="Next images"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </>
                    )}

                    {/* Page Indicators */}
                    {totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: totalPages }).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setGalleryPage(idx)}
                            className={`
                              h-2 rounded-full transition-all
                              ${idx === galleryPage 
                                ? 'w-8 bg-teal-600' 
                                : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                              }
                            `}
                            aria-label={`Go to page ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Page Counter */}
                    {totalPages > 1 && (
                      <p className="text-center text-sm text-muted-foreground mt-4">
                        {galleryPage + 1} of {totalPages}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </section>

        {/* Image Modal with Morph Animation */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                setSelectedImage(null);
                setSelectedImageId(null);
              }}
            >
              <motion.div
                layoutId={selectedImageId || "image-modal"}
                className="relative max-w-5xl max-h-[90vh] w-full h-full"
                initial={{ borderRadius: "0.5rem" }}
                animate={{ borderRadius: "0.5rem" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Image
                  src={selectedImage}
                  alt="Selected project image"
                  fill
                  className="object-contain"
                  unoptimized={selectedImage.startsWith("https://")}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 text-white hover:bg-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(null);
                      setSelectedImageId(null);
                    }}
                  >
                    ×
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mb-8 flex flex-col items-center justify-between gap-3 border-t-2 border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Woodstock Renewal Contracting. All rights reserved.</span>
          <span>Woodstock, GA · Licensed & Insured</span>
        </footer>
      </main>
    </div>
  );
}

