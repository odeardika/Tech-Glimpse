import Link from "next/link";
import { Suspense } from "react";
import NewsCard from "@/components/NewsCard/NewsCard";
import SkeletonCard from "@/components/NewsCard/SkeletonCard";
import PopupMenu from "@/components/PopupMenu/PopupMenu";
import News from "@/types/News";
import { ArrowRight, Zap, RefreshCw, Globe, Gift, ArrowUp, MessageSquare, Briefcase } from "lucide-react";

const HN_BASE = "https://hacker-news.firebaseio.com/v0";

type HNFeed = "topstories" | "beststories" | "askstories" | "jobstories";

async function fetchFeed(feed: HNFeed, limit: number): Promise<News[]> {
  try {
    const res = await fetch(`${HN_BASE}/${feed}.json?print=pretty`, {
      next: { revalidate: 3600 },
    });
    const ids: number[] = await res.json();

    const items = await Promise.all(
      ids.slice(0, limit).map(async (id) => {
        const r = await fetch(`${HN_BASE}/item/${id}.json?print=pretty`, {
          next: { revalidate: 3600 },
        });
        const item = await r.json();
        return {
          id: item.id,
          title: item.title ?? item.text?.replace(/<[^>]+>/g, "").slice(0, 120) ?? "",
          url: item.url ?? "",
          description: null,
          image: null,
          favicon: null,
          score: item.score,
          descendants: item.descendants,
          by: item.by,
          time: item.time,
          type: item.type,
        } satisfies News;
      })
    );

    return items;
  } catch {
    return [];
  }
}

function formatTime(unix?: number): string {
  if (!unix) return "";
  const diff = Math.floor((Date.now() / 1000 - unix) / 60);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

/* ── Section: Featured (top stories with meta scraping via our API) ── */
async function FeaturedNews() {
  const news = await fetchFeed("topstories", 3);
  if (news.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
}

/* ── Section: Best Stories ── */
async function BestStories() {
  const news = await fetchFeed("beststories", 3);
  if (news.length === 0) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
}

/* ── Section: Ask HN list ── */
async function AskHNList() {
  const news = await fetchFeed("askstories", 6);
  if (news.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      {news.map((item) => (
        <Link
          key={item.id}
          href={item.url || `https://news.ycombinator.com/item?id=${item.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-accent/20 hover:shadow-sm transition-all duration-200"
        >
          <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5 min-w-9">
            <ArrowUp size={13} strokeWidth={2} className="text-accent" />
            <span className="text-xs font-mono font-medium">{item.score ?? 0}</span>
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <p className="text-sm font-medium leading-snug line-clamp-2 text-foreground group-hover:text-accent transition-colors">
              {item.title}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
              {item.by && <span>{item.by}</span>}
              {item.descendants !== undefined && (
                <span className="flex items-center gap-1">
                  <MessageSquare size={10} strokeWidth={1.5} />
                  {item.descendants}
                </span>
              )}
              {item.time && <span className="ml-auto shrink-0">{formatTime(item.time)}</span>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ── Section: Jobs ── */
async function JobsList() {
  const news = await fetchFeed("jobstories", 5);
  if (news.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {news.map((item) => (
        <Link
          key={item.id}
          href={item.url || `https://news.ycombinator.com/item?id=${item.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-2 p-5 rounded-xl border border-border bg-card hover:border-accent/20 hover:shadow-sm transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <Briefcase size={14} className="text-accent" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium leading-snug line-clamp-3 text-foreground group-hover:text-accent transition-colors">
            {item.title}
          </p>
          {item.time && (
            <p className="text-xs text-muted-foreground font-mono mt-auto">{formatTime(item.time)}</p>
          )}
        </Link>
      ))}
    </div>
  );
}

function SkeletonGrid({ cols = 3 }: { cols?: number }) {
  return (
    <div className={`grid gap-6 ${cols === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

function SkeletonList({ rows = 6 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl shimmer-skeleton" />
      ))}
    </div>
  );
}

const stats = [
  { value: "500+", label: "Top stories daily", icon: Zap },
  { value: "Real-time", label: "Updated every hour", icon: RefreshCw },
  { value: "Global", label: "Sources worldwide", icon: Globe },
  { value: "Free", label: "Always free", icon: Gift },
];

export default function Home() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24">

      {/* ── Hero ── */}
      <section className="py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Daily tech digest
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl xl:text-7xl tracking-tight leading-[1.05] text-foreground">
            Stay ahead of<br />
            <span className="text-accent">the tech curve.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-md">
            Curated technology stories from the world&apos;s best sources, delivered fresh every day.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-md text-sm font-medium hover:bg-accent/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Browse News
              <ArrowRight size={16} strokeWidth={1.5} />
            </Link>
            <PopupMenu variant="ghost" label="Subscribe free" />
          </div>
        </div>

        {/* Right: decorative card mockup */}
        <div className="hidden lg:flex flex-col gap-4 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <div className="relative">
            <div className="absolute inset-0 translate-x-4 translate-y-4 bg-accent/5 border border-accent/10 rounded-2xl" />
            <div className="absolute inset-0 translate-x-2 translate-y-2 bg-accent/8 border border-accent/15 rounded-2xl" />
            <div className="relative bg-card border border-border rounded-2xl p-6 space-y-4 shadow-md">
              <div className="aspect-video bg-muted rounded-xl shimmer-skeleton" />
              <div className="space-y-2">
                <div className="shimmer-skeleton h-3 w-20 rounded-full" />
                <div className="shimmer-skeleton h-5 w-full rounded-md" />
                <div className="shimmer-skeleton h-5 w-4/5 rounded-md" />
                <div className="shimmer-skeleton h-3.5 w-full rounded-md mt-2" />
                <div className="shimmer-skeleton h-3.5 w-2/3 rounded-md" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-2 shadow-xs">
                <div className="aspect-video bg-muted rounded-lg shimmer-skeleton" />
                <div className="shimmer-skeleton h-3 w-12 rounded-full" />
                <div className="shimmer-skeleton h-4 w-full rounded-md" />
                <div className="shimmer-skeleton h-4 w-3/4 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-border py-12">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex flex-col gap-2">
              <Icon size={18} className="text-accent" strokeWidth={1.5} />
              <dt className="font-display font-bold text-2xl md:text-3xl text-foreground">{value}</dt>
              <dd className="text-sm text-muted-foreground">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Latest Stories (Top) ── */}
      <section className="py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-foreground">Latest Stories</h2>
            <p className="text-sm text-muted-foreground mt-1">Top-ranked right now on Hacker News</p>
          </div>
          <Link href="/news" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors shrink-0">
            View all <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
        <Suspense fallback={<SkeletonGrid />}>
          <FeaturedNews />
        </Suspense>
      </section>

      {/* ── Best Stories ── */}
      <section className="py-16 border-t border-border">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-foreground">Best Stories</h2>
            <p className="text-sm text-muted-foreground mt-1">Highest-voted stories of all time</p>
          </div>
          <Link href="/news?feed=beststories" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors shrink-0">
            View all <ArrowRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
        <Suspense fallback={<SkeletonGrid />}>
          <BestStories />
        </Suspense>
      </section>

      {/* ── Ask HN + Jobs (side by side on desktop) ── */}
      <section className="py-16 border-t border-border grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Ask HN */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl tracking-tight text-foreground">Ask HN</h2>
              <p className="text-sm text-muted-foreground mt-1">Community questions &amp; discussions</p>
            </div>
            <Link href="/news?feed=askstories" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors shrink-0">
              More <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
          <Suspense fallback={<SkeletonList />}>
            <AskHNList />
          </Suspense>
        </div>

        {/* Jobs */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-bold text-xl md:text-2xl tracking-tight text-foreground">Jobs</h2>
              <p className="text-sm text-muted-foreground mt-1">Latest tech job postings</p>
            </div>
            <Link href="/news?feed=jobstories" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors shrink-0">
              More <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
          <Suspense fallback={<SkeletonGrid cols={2} />}>
            <JobsList />
          </Suspense>
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="py-8 pb-20">
        <div className="bg-muted/60 border border-border rounded-2xl px-8 py-14 text-center space-y-6">
          <div className="space-y-3 max-w-lg mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground">
              Never miss a story.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Subscribe and get the best tech news delivered to your inbox every morning.
            </p>
          </div>
          <PopupMenu variant="primary" label="Subscribe — it's free" />
        </div>
      </section>

    </div>
  );
}
