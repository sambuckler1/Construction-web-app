import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Basement Proposal | Woodstock Renewal Contracting",
  description:
    "Your basement renovation proposal. Interactive 3D walkthrough and complete project details.",
};

export default function BasementShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout intentionally hides the navbar for an immersive 3D experience
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0a0a0b]">
      {/* Hide the global navbar on this page */}
      <style>{`
        nav, header, .navbar, [class*="navbar"], [class*="Navbar"] {
          display: none !important;
        }
      `}</style>
      {children}
      
      {/* Logo / Branding */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        <div className="text-right">
          <div className="text-white font-light tracking-[0.15em] text-sm">
            WOODSTOCK
          </div>
          <div className="text-amber-500/80 text-[10px] tracking-[0.2em] uppercase">
            Renewal Contracting
          </div>
        </div>
        <div className="w-px h-8 bg-white/20" />
        <img 
          src="/favicon.ico" 
          alt="Logo" 
          className="w-8 h-8 opacity-90"
        />
      </div>
      
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

