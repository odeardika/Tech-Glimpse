import Link from "next/link";
import { ArrowRight, Zap, Database, Code2, Globe, Mail, Github } from "lucide-react";

const stack = [
  {
    icon: Code2,
    name: "Next.js 15",
    description: "App Router with server components and Turbopack for fast builds.",
  },
  {
    icon: Globe,
    name: "Hacker News API",
    description: "Real-time stories fetched directly from the official Firebase API — no middleman.",
  },
  {
    icon: Database,
    name: "Supabase",
    description: "PostgreSQL database for storing newsletter subscribers.",
  },
  {
    icon: Zap,
    name: "Tailwind CSS v4",
    description: "Utility-first styling with a custom design system — warm neutrals, indigo accent.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24 pt-16 pb-24">

      {/* Hero */}
      <section className="max-w-2xl animate-fade-up">
        <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 rounded-full px-3 py-1 mb-6">
          About
        </div>
        <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight leading-[1.1] text-foreground mb-6">
          Tech news, without the noise.
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-4">
          Tech Glimpse is a clean, fast reader for technology news. It surfaces the best stories from
          Hacker News — one of the most signal-dense tech communities on the internet — and presents
          them in a distraction-free, well-designed interface.
        </p>
        <p className="text-base text-muted-foreground leading-relaxed">
          No ads. No algorithmic manipulation. No infinite scroll traps. Just the stories that matter,
          ranked by the community.
        </p>
      </section>

      {/* How it works */}
      <section className="mt-20 pt-16 border-t border-border">
        <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-foreground mb-2">
          How it works
        </h2>
        <p className="text-muted-foreground mb-10">
          Tech Glimpse pulls live data from the Hacker News Firebase API and enriches it with
          Open Graph metadata — so you see real images and descriptions, not just bare links.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stack.map(({ icon: Icon, name, description }) => (
            <div
              key={name}
              className="flex gap-4 p-5 rounded-xl border border-border bg-card hover:border-accent/20 hover:shadow-sm transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={16} className="text-accent" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground mb-1">{name}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data sources */}
      <section className="mt-16 pt-16 border-t border-border max-w-2xl">
        <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-foreground mb-4">
          Data & transparency
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          All stories come from{" "}
          <a
            href="https://news.ycombinator.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-accent transition-colors underline-offset-2 underline"
          >
            Hacker News
          </a>
          , operated by Y Combinator. Tech Glimpse is not affiliated with or endorsed by Hacker News
          or Y Combinator.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          The feeds available — Top, Best, New, Ask HN, and Jobs — map directly to the official HN
          API endpoints. Story rankings and scores are pulled live and reflect the community vote at
          fetch time.
        </p>
      </section>

      {/* Contact */}
      <section className="mt-16 pt-16 border-t border-border">
        <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-foreground mb-4">
          Get in touch
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl">
          Feedback, bug reports, or collaboration ideas — reach out through any of the channels below.
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:design@newgenwebdevelopment.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border bg-card text-sm font-medium text-foreground hover:border-accent/40 hover:bg-accent/5 transition-all duration-200"
          >
            <Mail size={15} strokeWidth={1.5} className="text-accent" />
            Email
          </a>
          <a
            href="https://github.com/odeardika"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border bg-card text-sm font-medium text-foreground hover:border-accent/40 hover:bg-accent/5 transition-all duration-200"
          >
            <Github size={15} strokeWidth={1.5} className="text-accent" />
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/odeardika"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border bg-card text-sm font-medium text-foreground hover:border-accent/40 hover:bg-accent/5 transition-all duration-200"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-accent" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 pt-16 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-md text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Browse News
            <ArrowRight size={15} strokeWidth={1.5} />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to home
          </Link>
        </div>
      </section>

    </div>
  );
}
