"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import the 3D scene to avoid SSR issues with Three.js
const BasementScene = dynamic(() => import("./BasementScene"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#0a0a0b] flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 border-2 border-amber-500/20 rounded-full" />
          <div className="absolute inset-0 border-2 border-transparent border-t-amber-500 rounded-full animate-spin" />
          <div className="absolute inset-2 border-2 border-transparent border-b-amber-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <p className="text-amber-500/80 font-light tracking-[0.3em] text-sm uppercase">
          Loading Experience
        </p>
      </div>
    </div>
  );
}

export default function BasementShowcasePage() {
  return (
    <main className="relative">
      <Suspense fallback={<LoadingScreen />}>
        <BasementScene />
      </Suspense>
    </main>
  );
}

