import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Basement Showcase | 3D Interactive Preview",
  description:
    "Explore Sean's basement renovation concept in stunning 3D. Interactive walkthrough of the complete design vision.",
};

export default function BasementShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout intentionally omits the navbar for an immersive 3D experience
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0b]">
      {children}
      
      {/* Back button to main site */}
      <a
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
      >
        <svg
          className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="text-sm tracking-widest uppercase">Back</span>
      </a>
    </div>
  );
}

