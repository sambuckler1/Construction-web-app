"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  ContactShadows,
  Html,
  useProgress,
  Center,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// Preload the model
useGLTF.preload("/models/sean-basement-model.glb");

interface ModelProps {
  scrollProgress: number;
}

function BasementModel({ scrollProgress }: ModelProps) {
  const { scene } = useGLTF("/models/sean-basement-model.glb");
  const modelRef = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(1);

  // Clone and scale the scene appropriately
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    // Calculate bounding box to determine proper scale
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Target size of about 8 units
    const targetSize = 8;
    const calculatedScale = targetSize / maxDim;
    setScale(calculatedScale);
    
    // Center the geometry
    const center = box.getCenter(new THREE.Vector3());
    clone.position.sub(center);
    
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
  }, [scene]);

  useFrame((state) => {
    if (modelRef.current) {
      // Subtle floating animation only - camera handles the orbit
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={modelRef} scale={scale} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  );
}

function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    // Cap animation at 90% scroll - last 10% is buffer zone where camera holds
    const cappedProgress = Math.min(scrollProgress / 0.9, 1);
    
    // Camera orbits 270 degrees around the model as user scrolls
    // Orbit angle: 0 to 1.5*PI (270 degrees)
    const angle = cappedProgress * Math.PI * 1.5;
    
    // Distance from center (radius of orbit)
    const radius = 12 - cappedProgress * 2; // Start at 12, end at 10
    
    // Height: start at 4, rise to 8 at the end for top-down view
    const height = 4 + cappedProgress * 4;
    
    // Calculate orbital position
    const targetX = Math.sin(angle) * radius;
    const targetZ = Math.cos(angle) * radius;
    const targetY = height;
    
    // Smooth camera movement
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.03);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03);
    
    // Always look at the center of the model
    lookAtTarget.current.set(0, 0, 0);
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-amber-500 font-light tracking-widest">
        {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

// Content sections that appear as you scroll
const sections = [
  {
    id: 1,
    title: "THE VISION",
    subtitle: "Sean's Basement",
    description:
      "A complete transformation of underutilized space into a stunning, functional living area.",
    position: 0,
  },
  {
    id: 2,
    title: "THE LAYOUT",
    subtitle: "Thoughtful Design",
    description:
      "Maximizing every square foot. Open concept living that flows naturally from space to space.",
    position: 0.11,
  },
  {
    id: 3,
    title: "CRAFTSMANSHIP",
    subtitle: "Premium Quality",
    description:
      "Every detail meticulously planned. Every corner thoughtfully designed for your lifestyle.",
    position: 0.22,
  },
  {
    id: 4,
    title: "THE STRUCTURE",
    subtitle: "Solid Foundation",
    description:
      "Professional framing, proper insulation, and code-compliant construction throughout.",
    position: 0.33,
  },
  {
    id: 5,
    title: "THE DETAILS",
    subtitle: "Built Right",
    description:
      "Quality materials, expert installation, and attention to the details that matter most.",
    position: 0.44,
  },
  {
    id: 6,
    title: "MODERN LIVING",
    subtitle: "Comfort & Style",
    description:
      "Seamless integration of lighting, storage, and entertainment. A space that feels like home.",
    position: 0.55,
  },
  {
    id: 7,
    title: "FUNCTIONALITY",
    subtitle: "Smart Spaces",
    description:
      "Every room designed with purpose. Flexible areas that adapt to your family's needs.",
    position: 0.66,
  },
  {
    id: 8,
    title: "THE FINISH",
    subtitle: "Polished Perfection",
    description:
      "Premium finishes, clean lines, and sophisticated touches that elevate the entire space.",
    position: 0.77,
  },
  {
    id: 9,
    title: "YOUR SPACE",
    subtitle: "Realized",
    description:
      "From concept to reality. Let's bring this vision to life together.",
    position: 0.88,
  },
];

export default function BasementScene() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);

      // Determine active section
      const newSection = sections.findIndex(
        (s, i) =>
          progress >= s.position &&
          (i === sections.length - 1 || progress < sections[i + 1].position)
      );
      if (newSection !== -1) {
        setActiveSection(newSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-50 bg-[#0a0a0b] flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-6xl md:text-8xl font-extralight text-white tracking-[0.2em] mb-4">
                BASEMENT
              </h1>
              <p className="text-amber-500/60 tracking-[0.5em] text-sm uppercase">
                Renovation Concept
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scrollable container */}
      <div ref={containerRef} className="relative">
        {/* Scroll indicator */}
        <motion.div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollProgress < 0.1 ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-white/40 text-xs tracking-[0.3em] uppercase">
            Scroll to Explore
          </span>
          <motion.div
            className="w-6 h-10 border border-white/20 rounded-full flex justify-center pt-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <motion.div className="w-1 h-2 bg-amber-500/60 rounded-full" />
          </motion.div>
        </motion.div>

        {/* Progress bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-white/5 z-50">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        {/* Navigation dots */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
          {sections.map((section, i) => (
            <button
              key={section.id}
              onClick={() => {
                const targetScroll =
                  section.position *
                  (document.documentElement.scrollHeight - window.innerHeight);
                window.scrollTo({ top: targetScroll, behavior: "smooth" });
              }}
              className="group flex items-center gap-3"
            >
              <span
                className={`text-xs tracking-widest transition-all duration-300 ${
                  i === activeSection
                    ? "text-amber-500 opacity-100"
                    : "text-white/30 opacity-0 group-hover:opacity-100"
                }`}
              >
                {section.title}
              </span>
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === activeSection
                    ? "bg-amber-500 scale-150"
                    : "bg-white/20 group-hover:bg-white/40"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Fixed 3D Canvas */}
        <div className="fixed inset-0 bg-[#0a0a0b]">
          <Canvas
            camera={{ position: [0, 4, 12], fov: 50 }}
            shadows
            gl={{ antialias: true, alpha: true }}
          >
            <fog attach="fog" args={["#0a0a0b", 20, 60]} />

            {/* Lighting - increased for better visibility */}
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[10, 15, 10]}
              intensity={1.5}
              castShadow
              shadow-mapSize={2048}
            />
            <spotLight
              position={[15, 15, 15]}
              angle={0.4}
              penumbra={1}
              intensity={1.5}
              castShadow
            />
            <spotLight
              position={[-15, 10, -15]}
              angle={0.5}
              penumbra={1}
              intensity={0.8}
              color="#fbbf24"
            />
            <pointLight position={[0, 10, 0]} intensity={0.5} color="#fbbf24" />
            {/* Fill light from below */}
            <pointLight position={[0, -5, 0]} intensity={0.3} color="#ffffff" />

            {/* Grid floor */}
            <gridHelper
              args={[50, 50, "#1a1a1f", "#1a1a1f"]}
              position={[0, -4, 0]}
            />

            {/* Model with auto-centering */}
            <Suspense fallback={<Loader />}>
              <Center>
                <BasementModel scrollProgress={scrollProgress} />
              </Center>
            </Suspense>

            {/* Camera movement based on scroll */}
            <CameraRig scrollProgress={scrollProgress} />

            {/* Soft shadows */}
            <ContactShadows
              position={[0, -4, 0]}
              opacity={0.4}
              scale={30}
              blur={2}
              far={10}
            />

            {/* Environment for reflections */}
            <Environment preset="city" />

            {/* Loading indicator */}
            <Loader />
          </Canvas>

          {/* Gradient overlays */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/80 via-transparent to-transparent" />
          </div>
        </div>

        {/* Scrollable content sections */}
        <div className="relative z-30">
          {sections.map((section, i) => (
            <section
              key={section.id}
              className="min-h-screen flex items-center px-8 md:px-16 lg:px-24"
            >
              <motion.div
                className="max-w-xl"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: false, amount: 0.5 }}
              >
                <span className="text-amber-500/60 text-sm tracking-[0.4em] uppercase mb-4 block">
                  0{i + 1} / 09
                </span>
                <h2 className="text-5xl md:text-7xl font-extralight text-white mb-2 tracking-tight">
                  {section.title}
                </h2>
                <h3 className="text-2xl md:text-3xl font-light text-amber-500 mb-6">
                  {section.subtitle}
                </h3>
                <p className="text-white/50 text-lg leading-relaxed max-w-md">
                  {section.description}
                </p>

                {i === sections.length - 1 && (
                  <motion.button
                    className="mt-10 px-8 py-4 bg-amber-500 text-black font-medium tracking-widest uppercase text-sm hover:bg-amber-400 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      document.getElementById('proposal')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    View Proposal
                  </motion.button>
                )}
              </motion.div>
            </section>
          ))}

          {/* Buffer section - camera holds, proposal peeks up */}
          <div className="h-[80vh] relative flex items-end justify-center pb-16">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: false, amount: 0.8 }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-white/30 text-xs tracking-[0.3em] uppercase">
                  Continue for Details
                </span>
                <svg 
                  className="w-6 h-6 text-amber-500/60" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ========== PROPOSAL SECTION ========== */}
      <div id="proposal" className="relative z-50 bg-[#0a0a0b]">
        {/* Decorative top border */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
        
        {/* Proposal Header */}
        <section className="py-24 px-8 md:px-16 lg:px-24">
          <motion.div
            className="max-w-6xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-amber-500/60 text-sm tracking-[0.4em] uppercase mb-4 block">
              Project Proposal
            </span>
            <h2 className="text-5xl md:text-7xl font-extralight text-white mb-6 tracking-tight">
              THE DETAILS
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              A comprehensive breakdown of your basement transformation project
            </p>
          </motion.div>
        </section>

        {/* Scope of Work */}
        <section className="py-16 px-8 md:px-16 lg:px-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h3 className="text-3xl md:text-4xl font-light text-white mb-2">
                Scope of Work
              </h3>
              <div className="w-20 h-0.5 bg-amber-500" />
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: "🏗️",
                  title: "Framing",
                  items: ["Wall framing per design", "Header installation", "Blocking for fixtures", "Sound insulation framing"],
                },
                {
                  icon: "⚡",
                  title: "Electrical",
                  items: ["Recessed lighting layout", "Outlet installation", "Switch wiring", "Panel connection"],
                },
                {
                  icon: "🔧",
                  title: "Plumbing",
                  items: ["Bathroom rough-in", "Drain connections", "Water supply lines", "Fixture prep"],
                },
                {
                  icon: "🌡️",
                  title: "HVAC",
                  items: ["Ductwork extension", "Vent installation", "Return air setup", "Thermostat wiring"],
                },
                {
                  icon: "🎨",
                  title: "Drywall & Finish",
                  items: ["Full drywall installation", "Taping & mudding", "Texture matching", "Prime & paint ready"],
                },
                {
                  icon: "🚪",
                  title: "Trim & Details",
                  items: ["Door frames & casings", "Baseboards", "Crown molding", "Window trim"],
                },
              ].map((scope, i) => (
                <motion.div
                  key={scope.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-amber-500/30 transition-colors group"
                >
                  <div className="text-3xl mb-4">{scope.icon}</div>
                  <h4 className="text-xl font-medium text-white mb-4 group-hover:text-amber-500 transition-colors">
                    {scope.title}
                  </h4>
                  <ul className="space-y-2">
                    {scope.items.map((item) => (
                      <li key={item} className="text-white/50 text-sm flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 px-8 md:px-16 lg:px-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h3 className="text-3xl md:text-4xl font-light text-white mb-2">
                Investment
              </h3>
              <div className="w-20 h-0.5 bg-amber-500" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl p-8 md:p-12"
            >
              <div className="grid md:grid-cols-2 gap-12">
                {/* Price Breakdown */}
                <div>
                  <h4 className="text-white/60 text-sm tracking-widest uppercase mb-6">
                    Cost Breakdown
                  </h4>
                  <div className="space-y-4">
                    {[
                      { item: "Framing & Structure", price: "$X,XXX" },
                      { item: "Electrical Work", price: "$X,XXX" },
                      { item: "Plumbing Rough-in", price: "$X,XXX" },
                      { item: "HVAC Extension", price: "$X,XXX" },
                      { item: "Drywall & Finishing", price: "$X,XXX" },
                      { item: "Trim & Millwork", price: "$X,XXX" },
                      { item: "Permits & Inspections", price: "$XXX" },
                    ].map((line) => (
                      <div key={line.item} className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-white/70">{line.item}</span>
                        <span className="text-white font-light">{line.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="flex flex-col justify-center items-center text-center">
                  <span className="text-white/40 text-sm tracking-widest uppercase mb-2">
                    Total Investment
                  </span>
                  <div className="text-6xl md:text-7xl font-extralight text-white mb-2">
                    $XX,XXX
                  </div>
                  <p className="text-white/40 text-sm mb-8">
                    *Final pricing subject to material selections
                  </p>
                  <div className="space-y-3 w-full max-w-xs">
                    <div className="flex items-center gap-3 text-white/60 text-sm">
                      <span className="text-amber-500">✓</span>
                      50% deposit to start
                    </div>
                    <div className="flex items-center gap-3 text-white/60 text-sm">
                      <span className="text-amber-500">✓</span>
                      25% at rough-in complete
                    </div>
                    <div className="flex items-center gap-3 text-white/60 text-sm">
                      <span className="text-amber-500">✓</span>
                      25% upon completion
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 px-8 md:px-16 lg:px-24">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h3 className="text-3xl md:text-4xl font-light text-white mb-2">
                Timeline
              </h3>
              <div className="w-20 h-0.5 bg-amber-500" />
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10" />

              {[
                { week: "Week 1-2", title: "Framing & Rough-In", desc: "Wall framing, electrical rough-in, plumbing prep" },
                { week: "Week 3", title: "HVAC & Inspections", desc: "Ductwork installation, rough-in inspections" },
                { week: "Week 4-5", title: "Drywall", desc: "Hanging, taping, mudding, and sanding" },
                { week: "Week 6", title: "Finishing Touches", desc: "Trim, paint prep, final details" },
              ].map((phase, i) => (
                <motion.div
                  key={phase.week}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center gap-8 mb-12 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-amber-500 rounded-full transform -translate-x-1/2 z-10" />
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
                    <span className="text-amber-500 text-sm tracking-widest uppercase">
                      {phase.week}
                    </span>
                    <h4 className="text-xl text-white font-medium mt-1">{phase.title}</h4>
                    <p className="text-white/50 mt-2">{phase.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included / Not Included */}
        <section className="py-16 px-8 md:px-16 lg:px-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Included */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-green-500/5 border border-green-500/20 rounded-xl p-8"
              >
                <h4 className="text-xl font-medium text-green-400 mb-6 flex items-center gap-2">
                  <span className="text-2xl">✓</span> What's Included
                </h4>
                <ul className="space-y-3">
                  {[
                    "All labor and installation",
                    "Material delivery & handling",
                    "Permit acquisition",
                    "All required inspections",
                    "Daily cleanup",
                    "2-year workmanship warranty",
                    "Project management",
                  ].map((item) => (
                    <li key={item} className="text-white/60 flex items-start gap-3">
                      <span className="text-green-500">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Not Included */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white/[0.02] border border-white/10 rounded-xl p-8"
              >
                <h4 className="text-xl font-medium text-white/60 mb-6 flex items-center gap-2">
                  <span className="text-2xl">○</span> Not Included
                </h4>
                <ul className="space-y-3">
                  {[
                    "Flooring installation",
                    "Bathroom fixtures",
                    "Paint & primer",
                    "Light fixtures",
                    "Furniture & decor",
                    "Window treatments",
                  ].map((item) => (
                    <li key={item} className="text-white/40 flex items-start gap-3">
                      <span className="text-white/20">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-8 md:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="text-white/50 text-lg mb-10 max-w-2xl mx-auto">
              Let's discuss the details and get your project started. We're excited to bring this vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="tel:+1234567890"
                className="px-10 py-4 bg-amber-500 text-black font-medium tracking-widest uppercase text-sm hover:bg-amber-400 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Call Now
              </motion.a>
              <motion.a
                href="mailto:info@example.com"
                className="px-10 py-4 border border-white/20 text-white font-medium tracking-widest uppercase text-sm hover:border-amber-500 hover:text-amber-500 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Email Us
              </motion.a>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-8 border-t border-white/10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-sm">
              © 2024 Woodstock Renewal Contracting. All rights reserved.
            </p>
            <p className="text-white/30 text-sm">
              Proposal valid for 30 days
            </p>
          </div>
        </footer>
      </div>

      {/* Info Panel */}
      <motion.div
        className="fixed bottom-8 right-8 z-40 hidden md:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3 }}
      >
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-5 space-y-4">
          <div>
            <span className="text-amber-500 text-2xl font-light">360°</span>
            <p className="text-white/40 text-xs tracking-widest uppercase">
              Interactive View
            </p>
          </div>
          <div className="w-full h-px bg-white/10" />
          <div>
            <span className="text-amber-500 text-2xl font-light">3D</span>
            <p className="text-white/40 text-xs tracking-widest uppercase">
              Model Preview
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

