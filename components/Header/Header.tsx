"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/hooks/useTheme";
import PopupMenu from "@/components/PopupMenu/PopupMenu";
import { cn } from "@/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggle } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md transition-all duration-200",
        scrolled && "border-b border-border shadow-sm"
      )}
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24 h-16 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="font-display font-bold text-xl tracking-tight text-foreground hover:text-accent transition-colors shrink-0"
        >
          Tech Glimpse
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors",
              pathname === "/"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Home
          </Link>
          <Link
            href="/news"
            className={cn(
              "text-sm font-medium transition-colors",
              pathname === "/news"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Browse
          </Link>
          <Link
            href="/about"
            className={cn(
              "text-sm font-medium transition-colors",
              pathname === "/about"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <PopupMenu variant="ghost" label="Subscribe" />
          <button
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          >
            {isDark ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </div>
    </header>
  );
}
