"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleContactClick = () => {
    if (pathname === "/construction") {
      // Scroll to inquiry form on construction page
      document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate to construction page with hash
      window.location.href = "/construction#inquiry";
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-12 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1">
          <Link href="/" className="text-sm sm:text-xl font-bold text-foreground">
            Woodstock Renewal
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant={pathname === "/construction" || pathname === "/" ? "default" : "ghost"}
            asChild
            className="rounded-full text-xs sm:text-sm h-7 sm:h-9 px-2 sm:px-4"
          >
            <Link href="/">Construction</Link>
          </Button>
          <Button
            variant={pathname === "/dumpster-rentals" ? "default" : "ghost"}
            asChild
            className="rounded-full text-xs sm:text-sm h-7 sm:h-9 px-2 sm:px-4"
          >
            <Link href="/dumpster-rentals">Dumpster Rentals</Link>
          </Button>
          <Button
            onClick={handleContactClick}
            className="rounded-full bg-teal-600 text-white text-xs sm:text-sm h-7 sm:h-9 px-3 sm:px-4 hover:bg-teal-700"
          >
            Get a Quote
          </Button>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="sm:hidden flex items-center gap-2">
          <Button
            onClick={handleContactClick}
            className="rounded-full bg-teal-600 text-white text-xs h-7 px-3 hover:bg-teal-700"
          >
            Contact
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="px-3 py-2 space-y-1">
            <Button
              variant={pathname === "/construction" || pathname === "/" ? "default" : "ghost"}
              asChild
              className="w-full justify-start rounded-full text-sm h-9"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/">Construction</Link>
            </Button>
            <Button
              variant={pathname === "/dumpster-rentals" ? "default" : "ghost"}
              asChild
              className="w-full justify-start rounded-full text-sm h-9"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Link href="/dumpster-rentals">Dumpster Rentals</Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

