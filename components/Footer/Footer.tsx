"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import axios from "axios";

function InlineSubscribe() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [duplicate, setDuplicate] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setDuplicate(false);
    try {
      await axios.post("/api/email/create", { email });
      setSuccess(true);
      setEmail("");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setDuplicate(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <p className="text-xs text-accent font-medium py-2">
        ✓ You&apos;re in! Check your inbox for a welcome email.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <form onSubmit={handleSubscribe} className="flex gap-2">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow min-w-0"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          {isLoading && <Loader2 size={14} className="animate-spin" />}
          {isLoading ? "…" : "Join"}
        </button>
      </form>
      {duplicate && (
        <p className="text-xs text-muted-foreground">This email is already subscribed.</p>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Col 1 — Brand */}
          <div className="space-y-3">
            <p className="font-display font-bold text-lg tracking-tight text-foreground">
              Tech Glimpse
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your daily dose of tech, curated.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed pt-1">
              Built by{" "}
              <a
                href="https://odeardika.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-accent transition-colors underline-offset-2 hover:underline"
              >
                Ode Ardika
              </a>
              . Powered by{" "}
              <a
                href="https://news.ycombinator.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-accent transition-colors underline-offset-2 hover:underline"
              >
                Hacker News
              </a>
              .
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://github.com/odeardika"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/odeardika"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://medium.com/@odeardika"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Medium"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2 — Navigation */}
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Navigation
            </p>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/news" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Browse News
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </nav>
          </div>

          {/* Col 3 — Subscribe */}
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Stay updated
            </p>
            <p className="text-xs text-muted-foreground">
              Daily digest · No spam · Unsubscribe anytime
            </p>
            <InlineSubscribe />
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Tech Glimpse. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Data from{" "}
            <a
              href="https://news.ycombinator.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline-offset-2 hover:underline"
            >
              Hacker News
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
