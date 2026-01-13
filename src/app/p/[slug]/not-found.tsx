import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-6xl font-extralight text-white mb-4">404</h1>
        <p className="text-white/50 text-lg mb-8">
          This proposal link is invalid or has expired.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-amber-500 text-black font-medium tracking-widest uppercase text-sm hover:bg-amber-400 transition-colors"
        >
          Visit Our Website
        </Link>
      </div>
    </div>
  );
}

