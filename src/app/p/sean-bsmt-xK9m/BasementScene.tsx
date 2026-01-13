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
  Sparkles,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { motion } from "framer-motion";
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
    // Cap animation at 85% - rest is buffer where camera holds still
    const cappedProgress = Math.min(scrollProgress / 0.85, 1);
    
    let targetX: number, targetY: number, targetZ: number;
    
    // Phase 1: 0-55% - 180° orbit around model
    if (cappedProgress <= 0.55) {
      const phaseProgress = cappedProgress / 0.55;
      const angle = phaseProgress * Math.PI; // 0 to 180 degrees
      const radius = 12;
      const height = 4 + phaseProgress * 2;
      
      targetX = Math.sin(angle) * radius;
      targetZ = Math.cos(angle) * radius;
      targetY = height;
    }
    // Phase 2: 55-100% - Additional 90° + zoom in (then hold)
    else {
      const phaseProgress = (cappedProgress - 0.55) / 0.45;
      const angle = Math.PI + phaseProgress * (Math.PI / 2); // 180 to 270 degrees
      const radius = 12 - phaseProgress * 4; // 12 to 8
      const height = 6 - phaseProgress * 2; // 6 to 4
      
      targetX = Math.sin(angle) * radius;
      targetZ = Math.cos(angle) * radius;
      targetY = height;
    }
    
    // Smooth camera movement
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.03);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03);
    
    // Always look at center
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

// Easing function: starts fast, slows down at end
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function BasementScene() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const rawProgress = Math.min(scrollTop / docHeight, 1);
      
      // Apply easing: faster at start, slower at end
      const easedProgress = easeOutCubic(rawProgress);
      setScrollProgress(easedProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>

      {/* Scrollable container */}
      <div ref={containerRef} className="relative">
        {/* Minimal progress bar - fades in after first scroll */}
        <motion.div 
          className="fixed top-0 left-0 w-full h-0.5 bg-white/5 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollProgress > 0.05 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </motion.div>

        {/* Fixed 3D Canvas */}
        <div className="fixed inset-0 bg-[#0a0a0b]">
          <Canvas
            camera={{ position: [0, 4, 12], fov: 50 }}
            shadows
            gl={{ 
              antialias: true, 
              alpha: true,
              toneMapping: THREE.NoToneMapping, // Preserve original colors
            }}
            linear // Use linear color space to keep original material colors
          >
            <fog attach="fog" args={["#0a0a0b", 20, 60]} />

            {/* Neutral lighting to show true material colors */}
            <ambientLight intensity={0.8} color="#ffffff" />
            <directionalLight
              position={[10, 15, 10]}
              intensity={1.2}
              color="#ffffff"
              castShadow
              shadow-mapSize={2048}
            />
            <directionalLight
              position={[-10, 10, -10]}
              intensity={0.6}
              color="#ffffff"
            />
            {/* Fill light from below */}
            <hemisphereLight 
              args={["#ffffff", "#444444", 0.6]} 
            />

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

            {/* Welcome text in 3D space - fades on scroll */}
            <Html
              center
              position={[0, 2, 0]}
              style={{
                opacity: Math.max(0, 1 - scrollProgress * 5),
                transition: 'opacity 0.3s ease-out',
                pointerEvents: 'none',
              }}
            >
              <div className="text-center whitespace-nowrap">
                <h1 className="text-4xl md:text-5xl font-extralight text-white tracking-[0.1em] mb-3 drop-shadow-lg">
                  Welcome to Your Proposal
                </h1>
                <p 
                  className="text-amber-500/80 tracking-[0.3em] text-sm uppercase"
                  style={{ animation: 'pulse 2s ease-in-out infinite' }}
                >
                  Scroll to explore
                </p>
              </div>
            </Html>

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

            {/* Environment for subtle reflections - low intensity to preserve material colors */}
            <Environment preset="warehouse" environmentIntensity={0.3} />

            {/* Floating dust particles for atmosphere */}
            <Sparkles
              count={100}
              scale={20}
              size={2}
              speed={0.3}
              opacity={0.4}
              color="#ffffff"
            />

            {/* Post-processing effects */}
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.6}
                luminanceSmoothing={0.9}
                intensity={0.4}
              />
              <Vignette
                offset={0.3}
                darkness={0.6}
              />
            </EffectComposer>

            {/* Loading indicator */}
            <Loader />
          </Canvas>

          {/* Gradient overlays */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/80 via-transparent to-transparent" />
          </div>
        </div>

        {/* Long scroll area for 3D animation - 3 "screens" worth of scrolling */}
        <div className="relative z-30 h-[400vh]" />
        
        {/* Buffer with "continue" hint */}
        <div className="relative z-30 h-[50vh] flex items-end justify-center pb-16">
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

            {/* Main scope description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12 text-white/60 text-lg leading-relaxed max-w-4xl"
            >
              <p>
                Complete finishing of your <span className="text-white">1,215 sq ft basement (45' × 27')</span> — 
                including walls covering all concrete surfaces, enclosing the staircase area, 
                a dedicated 9'×19' storage room, and enclosing the support columns from ceiling 
                to floor for a clean, finished appearance.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: "🧱",
                  title: "Insulation",
                  items: [
                    "1-inch insulation boards all around",
                    "Attached to concrete with adhesive",
                    "R-value of 5 (code compliant)"
                  ],
                },
                {
                  icon: "🏗️",
                  title: "Framing",
                  items: [
                    "2×4 kiln-dried studs",
                    "Pressure treated bottom plate",
                    "Anchored to concrete floor",
                    "Column enclosures included"
                  ],
                },
                {
                  icon: "🎨",
                  title: "Drywall",
                  items: [
                    "½\" moisture resistant drywall",
                    "Upgrade to purple mold-resistant available",
                    "Professional taping and mudding",
                    "Corner beads throughout"
                  ],
                },
                {
                  icon: "🔲",
                  title: "Ceiling",
                  items: [
                    "Drop ceiling installation",
                    "Premium grid system",
                    "2×2 ceiling tiles"
                  ],
                },
                {
                  icon: "🪵",
                  title: "Flooring",
                  items: [
                    "Laminate flooring installation",
                    "Underlayment included",
                    "Medium-tier quality (~$2/sqft material)",
                    "Color selection available"
                  ],
                },
                {
                  icon: "🚪",
                  title: "Storage & Doors",
                  items: [
                    "9' × 19' storage room with door",
                    "Under-staircase storage with door",
                    "Door framing and casings included"
                  ],
                },
                {
                  icon: "🔨",
                  title: "Trim & Baseboards",
                  items: [
                    "5.5\" wide baseboards throughout",
                    "Optional shoe molding available",
                    "Professional finishing"
                  ],
                },
                {
                  icon: "🎨",
                  title: "Painting",
                  items: [
                    "Labor for painting included",
                    "Any color of your choice",
                    "Walls and trim"
                  ],
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

        {/* Materials Section */}
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
                Materials
              </h3>
              <div className="w-20 h-0.5 bg-amber-500" />
            </motion.div>

            <div className="space-y-1">
              {[
                {
                  image: "/models/basement-materials/insulation_board.png",
                  title: "Insulation Board",
                  description: "1\" rigid foam insulation placed between concrete and 2×4 framing. Attached with adhesive. Provides R-value of 5 (code compliant)."
                },
                {
                  image: "/models/basement-materials/framing_board.png",
                  title: "Framing Lumber",
                  description: "Kiln-dried 2×4 studs for framing out all walls. Pressure-treated bottom plates anchored to concrete. Installed by our experienced framing crew."
                },
                {
                  image: "/models/basement-materials/drywall_board.png",
                  title: "Drywall",
                  description: "Moisture resistant ½\" 4×8 sheets of drywall mounted on 2×4 framing. Professionally taped and mudded with corner beads. Upgrade to purple mold-resistant board available."
                },
                {
                  image: "/models/basement-materials/drop_ceiling.png",
                  title: "Drop Ceiling",
                  description: "Premium drop ceiling system with clean grid lines. This example shows the quality level we install — modern, professional appearance with easy access to utilities above."
                },
                {
                  image: "/models/basement-materials/flooring.png",
                  title: "Flooring Options",
                  description: "Quality laminate flooring options at medium-tier pricing (~$2/sqft material cost). Various colors and styles available — we recommend researching preferences before selection."
                },
                {
                  image: "/models/basement-materials/trim.png",
                  title: "Baseboards",
                  description: "5.5\" wide square-profile baseboards throughout all finished spaces. Optional shoe molding can be added for extra dimension and a more refined look."
                },
                {
                  image: "/models/basement-materials/door.png",
                  title: "Storage Room Doors",
                  description: "Standard interior doors for both storage rooms — the main 9'×19' storage and the under-staircase storage. Includes framing, casings, and hardware."
                },
              ].map((material, i) => (
                <motion.div
                  key={material.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className={`flex flex-col md:flex-row gap-8 items-center py-10 ${
                    i !== 0 ? "border-t border-white/5" : ""
                  } ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                >
                  {/* Image */}
                  <div className="w-full md:w-2/5 flex-shrink-0">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-white/5">
                      <img
                        src={material.image}
                        alt={material.title}
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="w-full md:w-3/5">
                    <h4 className="text-2xl font-light text-white mb-4">
                      {material.title}
                    </h4>
                    <p className="text-white/50 leading-relaxed">
                      {material.description}
                    </p>
                  </div>
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
                      { item: "Insulation, Framing & Drywall", price: "$16,665" },
                      { item: "Drop Ceiling (2×2 tiles)", price: "$11,638" },
                      { item: "Flooring & Underlayment", price: "$8,000" },
                      { item: "Painting (labor)", price: "$4,835" },
                      { item: "HVAC Soffits / Ceiling Obstructions", price: "$2,500" },
                      { item: "Baseboards", price: "$2,169" },
                      { item: "Dumpsters & Junk Removal", price: "$2,000" },
                      { item: "Doors (framing, casings, install)", price: "$850" },
                      { item: "Permits & Fees", price: "$350" },
                    ].map((line) => (
                      <div key={line.item} className="flex justify-between items-center py-3 border-b border-white/10">
                        <span className="text-white/70">{line.item}</span>
                        <span className="text-white font-light tabular-nums">{line.price}</span>
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
                    $49,007
                  </div>
                  <div className="text-white/40 text-sm mb-1">
                    1,215 sq ft (45' × 27')
                  </div>
                  <div className="text-amber-500/70 text-sm mb-6">
                    ~$40/sq ft
                  </div>
                  <div className="space-y-3 w-full max-w-xs">
                    <div className="flex items-center gap-3 text-white/60 text-sm">
                      <span className="text-amber-500">✓</span>
                      50% deposit to start — $24,504
                    </div>
                    <div className="flex items-center gap-3 text-white/60 text-sm">
                      <span className="text-amber-500">✓</span>
                      25% at rough-in complete — $12,252
                    </div>
                    <div className="flex items-center gap-3 text-white/60 text-sm">
                      <span className="text-amber-500">✓</span>
                      25% upon completion — $12,251
                    </div>
                  </div>
                </div>
              </div>

              {/* Fine Print */}
              <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                <p className="text-white/30 text-xs">
                  ⚠️ Price assumes slab is flat within manufacturer tolerance and free of moisture issues. 
                  Any leveling, grinding, or mitigation is additional.
                </p>
                <p className="text-white/30 text-xs">
                  Price includes standard fire-blocking required for inspection approval. 
                  Any non-standard or upgraded fireproofing required by inspector is subject to change order.
                </p>
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
                { week: "Week 0-1", title: "Prep Work", desc: "Submit drawings, prep basement, organize material logistics" },
                { week: "Week 1-2", title: "Framing", desc: "Complete framing with 2×4 studs, insulation installation, column enclosures" },
                { week: "Pause", title: "Inspections & Electrical", desc: "Wait for framing inspections, coordinate electrical work by your electrician" },
                { week: "Week 2-3", title: "Drywall", desc: "Drywall installation, taping, mudding, ceiling prep" },
                { week: "Week 3-4", title: "Ceiling", desc: "Drop ceiling grid and tile installation" },
                { week: "Week 4-5", title: "Flooring & Baseboards", desc: "Laminate flooring installation, baseboard trim throughout" },
                { week: "Week 5-6", title: "Painting & Final Touches", desc: "Painting walls and trim, final cleanup and walkthrough" },
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
                    "All labor for framing, insulation & drywall",
                    "1\" insulation board installation",
                    "2×4 framing with PT bottom plates",
                    "½\" moisture resistant drywall",
                    "Professional taping & mudding",
                    "Drop ceiling (grid system & tiles)",
                    "Laminate flooring with underlayment",
                    "5.5\" baseboards throughout",
                    "Two storage room doors with framing & casings",
                    "Column enclosures",
                    "Painting labor",
                    "Dumpsters & junk removal",
                    "Permits & inspection fees",
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
                    "Storage room finishing — rooms will be framed only (no flooring or drywall). OSB plywood or full finish available via change order.",
                    "Slab leveling, grinding, or moisture mitigation — price assumes slab is flat within manufacturer tolerance and free of moisture issues.",
                    "Fixtures (outlets, outlet covers, lighting caps) — materials",
                    "Dehumidifier — materials (TBD)",
                    "Paint & primer — materials",
                    "Mold remediation",
                    "HVAC modifications or ducting",
                    "Plumbing work of any kind",
                    "Fire suppression / sprinkler work",
                    "Asbestos or hazardous material removal",
                  ].map((item) => (
                    <li key={item} className="text-white/40 flex items-start gap-3">
                      <span className="text-white/20">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Warranty Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-8 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-xl p-8"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">🛡️</div>
                <div className="flex-1">
                  <h4 className="text-xl font-medium text-amber-400 mb-3">
                    1-Year Workmanship Warranty
                  </h4>
                  <p className="text-white/60 leading-relaxed mb-4">
                    We stand behind our work. All labor and installation performed under this contract 
                    is warranted against defects in workmanship for a period of <span className="text-white">one (1) year</span> from 
                    the date of project completion.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="text-white/50">
                      <span className="text-amber-500 font-medium">Covered:</span> Defects in workmanship including 
                      drywall cracks from improper installation, nail pops, loose trim, flooring installation issues, 
                      ceiling grid problems, and door adjustments.
                    </p>
                    <p className="text-white/40">
                      <span className="text-white/50 font-medium">Not covered:</span> Normal settling, hairline cracks 
                      due to house movement, damage caused by water intrusion or moisture not present at time of install, 
                      alterations made by others, damage from improper use, or issues arising from work performed outside 
                      this scope (e.g., electrical, plumbing, HVAC).
                    </p>
                  </div>
                  <p className="text-white/30 text-xs mt-4 italic">
                    Warranty claims must be submitted in writing within the warranty period. We will inspect and repair 
                    qualifying issues at no additional cost within a reasonable timeframe.
                  </p>
                </div>
              </div>
            </motion.div>
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
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Let's discuss the details and get your project started.
            </p>
            <p className="text-amber-500 text-xl mt-6 tracking-wide">
              Text or call Sam
            </p>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-8 border-t border-white/10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-sm">
              © 2026 Woodstock Renewal Contracting. All rights reserved.
            </p>
            <p className="text-white/30 text-sm">
              Proposal valid for 30 days
            </p>
          </div>
        </footer>
      </div>

    </>
  );
}

