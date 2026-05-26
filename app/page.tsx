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

        {/* Right: decorative dummy article cards */}
        <div className="hidden lg:flex flex-col gap-4 animate-fade-in" style={{ animationDelay: "150ms" }}>
          {/* Featured card — OpenAI / GPT-5 */}
          <div className="relative">
            <div className="absolute inset-0 translate-x-4 translate-y-4 bg-accent/5 border border-accent/10 rounded-2xl" />
            <div className="absolute inset-0 translate-x-2 translate-y-2 bg-accent/8 border border-accent/15 rounded-2xl" />
            <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-md">
              {/* Thumbnail */}
              <div className="aspect-video bg-[#0d0d0d] relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-linear-to-br from-[#10a37f]/30 via-transparent to-transparent" />
                {/* OpenAI logo SVG inline */}
                <svg viewBox="0 0 320 320" className="w-20 h-20 opacity-90" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M297.1 130.6c7.4-21.7 5-45.4-6.5-65.2-17.3-29.9-51.2-45.3-85-37.7C191.3 10.5 170.1 0 147.5 0 113.4 0 83.4 22.1 73.1 54.5 51.2 58.9 32 72.5 20.3 92.1c-17.5 30-13.5 67.6 9.9 93.3-7.4 21.7-5 45.4 6.5 65.2 17.3 29.9 51.2 45.3 85 37.7 13.3 17.3 34.5 27.7 57.1 27.7 34.1 0 64.1-22.1 74.4-54.5 21.9-4.4 41.1-18 52.8-37.6 17.5-30 13.5-67.6-9.9-93.3zm-130 174.2c-14.7 0-28.8-5.1-39.9-14.4l2-1.1 66.3-38.3c3.3-1.9 5.4-5.5 5.4-9.3V141l28 16.2c.3.2.5.5.5.8v77.5c0 38.3-31.1 69.3-62.3 69.3zM45.2 253.5c-7.4-12.8-10-27.8-7.3-42.3l2 1.2 66.3 38.3c3.3 1.9 7.4 1.9 10.7 0l80.9-46.7v32.4c0 .4-.2.7-.5.9l-67 38.7c-33.1 19.1-75.5 7.8-85.1-22.5zM29.1 105c7.3-12.7 18.9-22.4 32.7-27.3v79c0 3.8 2 7.3 5.4 9.3l80.9 46.7-28 16.2c-.3.2-.7.2-1 0l-66.9-38.7C19 170.8 8.2 128.5 29.1 105zm229.6 59.6-80.9-46.7 28-16.2c.3-.2.7-.2 1 0l66.9 38.7c33.2 19.2 44 61.6 23.1 84.8-7.4 12.7-18.9 22.4-32.7 27.3V173c0-3.8-2-7.3-5.4-9.4zm27.9-42.6-2-1.2-66.3-38.3c-3.3-1.9-7.4-1.9-10.7 0L127 129.2V96.8c0-.4.2-.7.5-.9l67-38.6c33.2-19.2 75.6-7.7 85.1 22.7 7.3 12.8 10 27.8 7.3 42.3l-3.3-.3zm-175.4 57.7-28-16.2c-.3-.2-.5-.5-.5-.8v-77.5c0-38.4 31.5-69.6 63-69.3 14.7 0 28.8 5.1 39.9 14.4l-2 1.1-66.3 38.3c-3.3 1.9-5.4 5.5-5.4 9.3v93.3l-0.7.4zm15.2-32.8 36-20.8 36 20.7v41.5l-36 20.8-36-20.8V147z"/>
                </svg>
                <div className="absolute inset-0 bg-linear-to-t from-[#0d0d0d]/80 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm text-accent border border-accent/20">
                    AI
                  </span>
                </div>
              </div>
              {/* Body */}
              <div className="p-5 space-y-2.5">
                <h3 className="font-display font-bold text-sm leading-snug text-foreground">
                  GPT-5 achieves superhuman performance on software engineering benchmarks
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  Researchers report the model autonomously resolves 72% of real-world GitHub issues, surpassing human engineer baselines.
                </p>
                <div className="flex items-center gap-3 pt-1 border-t border-border/60">
                  <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
                    <ArrowUp size={12} strokeWidth={2.5} className="text-accent" />
                    2841
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare size={11} strokeWidth={1.5} />
                    314
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto font-mono">3h ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Two smaller cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Linux / kernel.org */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
              <div className="aspect-video bg-[#1a1a2e] relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-yellow-400/20 via-transparent to-transparent" />
                {/* Tux penguin simplified SVG */}
                <svg viewBox="0 0 100 100" className="w-14 h-14 opacity-85" xmlns="http://www.w3.org/2000/svg">
                  <ellipse cx="50" cy="35" rx="22" ry="26" fill="#f5d042"/>
                  <ellipse cx="50" cy="60" rx="18" ry="22" fill="#1a1a1a"/>
                  <ellipse cx="50" cy="62" rx="11" ry="14" fill="#f5f0dc"/>
                  <circle cx="43" cy="30" r="4" fill="#1a1a1a"/>
                  <circle cx="57" cy="30" r="4" fill="#1a1a1a"/>
                  <ellipse cx="50" cy="39" rx="5" ry="3.5" fill="#f5821f"/>
                  <ellipse cx="35" cy="68" rx="7" ry="4" fill="#f5821f" transform="rotate(-20 35 68)"/>
                  <ellipse cx="65" cy="68" rx="7" ry="4" fill="#f5821f" transform="rotate(20 65 68)"/>
                </svg>
                <div className="absolute inset-0 bg-linear-to-t from-[#1a1a2e]/90 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-background/80 backdrop-blur-sm text-accent border border-accent/20">
                    Open Source
                  </span>
                </div>
              </div>
              <div className="p-3 space-y-1.5">
                <h3 className="font-display font-bold text-xs leading-snug text-foreground line-clamp-2">
                  Linux kernel 7.0 ships with Rust as first-class language
                </h3>
                <div className="flex items-center gap-2 pt-1 border-t border-border/60">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-foreground">
                    <ArrowUp size={10} strokeWidth={2.5} className="text-accent" />
                    1923
                  </span>
                  <span className="text-[11px] text-muted-foreground ml-auto font-mono">5h ago</span>
                </div>
              </div>
            </div>

            {/* Bun */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
              <div className="aspect-video bg-[#fbf0dd] relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-orange-300/30 via-transparent to-transparent" />
                {/* Bun logo — the bun emoji / wordmark approximation */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-4xl leading-none select-none">🍞</span>
                  <span className="text-[10px] font-black tracking-widest text-orange-900/60 uppercase font-mono">bun</span>
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-[#fbf0dd]/90 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-background/80 backdrop-blur-sm text-accent border border-accent/20">
                    Web
                  </span>
                </div>
              </div>
              <div className="p-3 space-y-1.5">
                <h3 className="font-display font-bold text-xs leading-snug text-foreground line-clamp-2">
                  Bun 2.0 outruns Node by 4× in latest HTTP benchmark suite
                </h3>
                <div className="flex items-center gap-2 pt-1 border-t border-border/60">
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-foreground">
                    <ArrowUp size={10} strokeWidth={2.5} className="text-accent" />
                    1547
                  </span>
                  <span className="text-[11px] text-muted-foreground ml-auto font-mono">7h ago</span>
                </div>
              </div>
            </div>
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
