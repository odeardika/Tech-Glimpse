"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import News from "@/types/News";
import NewsCardGrid from "@/components/NewsCard/NewsCardGrid";
import NewsCard from "@/components/NewsCard/NewsCard";
import SkeletonCard from "@/components/NewsCard/SkeletonCard";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Feed = "topstories" | "beststories" | "newstories" | "askstories" | "jobstories";

interface Tab {
  id: Feed;
  label: string;
  description: string;
}

const TABS: Tab[] = [
  { id: "topstories", label: "Top", description: "Top-ranked stories right now" },
  { id: "beststories", label: "Best", description: "Highest-voted stories of all time" },
  { id: "newstories", label: "New", description: "Freshest submissions" },
  { id: "askstories", label: "Ask HN", description: "Community questions & discussions" },
  { id: "jobstories", label: "Jobs", description: "Tech job postings" },
];

const LIST_FEEDS: Feed[] = ["askstories", "jobstories"];
const VALID_FEEDS = new Set<Feed>(["topstories", "beststories", "newstories", "askstories", "jobstories"]);
const PAGE_SIZE = 10;

export default function NewsPage() {
  const searchParams = useSearchParams();
  const feedParam = searchParams.get("feed") as Feed | null;
  const initialFeed: Feed = feedParam && VALID_FEEDS.has(feedParam) ? feedParam : "topstories";

  const [activeFeed, setActiveFeed] = useState<Feed>(initialFeed);
  const [selectedSegment, setSelectedSegment] = useState(1);

  // ID list for current feed — fetched once per feed switch
  const [allIds, setAllIds] = useState<number[]>([]);
  const [pageIndex, setPageIndex] = useState(0); // how many pages loaded

  const [news, setNews] = useState<News[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Fetch IDs for a feed, then load first page
  const initFeed = useCallback(async (feed: Feed) => {
    setLoadingInitial(true);
    setNews([]);
    setAllIds([]);
    setPageIndex(0);
    setError(false);
    setHasMore(true);

    try {
      const { data } = await axios.get<{ ids: number[] }>(`/api/news/ids?feed=${feed}`);
      const ids = data.ids ?? [];
      setAllIds(ids);

      // Load first page immediately
      const firstBatch = ids.slice(0, PAGE_SIZE);
      if (firstBatch.length === 0) {
        setHasMore(false);
        setLoadingInitial(false);
        return;
      }

      const { data: itemData } = await axios.get<{ news: News[] }>(
        `/api/news/items?feed=${feed}&ids=${firstBatch.join(",")}`
      );
      setNews(itemData.news ?? []);
      setPageIndex(1);
      setHasMore(ids.length > PAGE_SIZE);
    } catch {
      setError(true);
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  // Load next page
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || allIds.length === 0) return;

    const start = pageIndex * PAGE_SIZE;
    const batch = allIds.slice(start, start + PAGE_SIZE);
    if (batch.length === 0) {
      setHasMore(false);
      return;
    }

    setLoadingMore(true);
    try {
      const { data } = await axios.get<{ news: News[] }>(
        `/api/news/items?feed=${activeFeed}&ids=${batch.join(",")}`
      );
      setNews((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const fresh = (data.news ?? []).filter((n) => !existingIds.has(n.id));
        return [...prev, ...fresh];
      });
      setPageIndex((p) => p + 1);
      setHasMore(start + PAGE_SIZE < allIds.length);
    } catch {
      // silent — user can scroll again to retry
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, allIds, pageIndex, activeFeed]);

  // Init on feed change
  useEffect(() => {
    initFeed(activeFeed);
  }, [activeFeed, initFeed]);

  // Intersection Observer on sentinel
  useEffect(() => {
    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [loadMore]);

  const isList = LIST_FEEDS.includes(activeFeed);
  const activeTab = TABS.find((t) => t.id === activeFeed)!;

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24 pt-10 pb-24">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground">
          Browse News
        </h1>
        <p className="mt-2 text-muted-foreground text-base">{activeTab.description}</p>
      </div>

      {/* Feed tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-px mb-6 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFeed(tab.id)}
            className={cn(
              "shrink-0 px-4 py-2 text-sm font-medium rounded-t-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
              activeFeed === tab.id
                ? "text-accent border-b-2 border-accent -mb-px"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}

        {!isList && (
          <div className="ml-auto shrink-0">
            <SegmentedControl cb={(value) => setSelectedSegment(value)} />
          </div>
        )}
      </div>

      {/* Story count */}
      <p className="text-xs text-muted-foreground font-mono mb-4">
        {loadingInitial
          ? "Loading…"
          : news.length > 0
          ? `${news.length} of ${allIds.length} stories`
          : ""}
      </p>

      {/* Error */}
      {error && (
        <div className="flex h-48 w-full justify-center items-center">
          <p className="text-muted-foreground">Failed to load. Please try again.</p>
        </div>
      )}

      {/* Initial skeleton */}
      {!error && loadingInitial && (
        isList ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl shimmer-skeleton" />
            ))}
          </div>
        ) : (
          <div className={cn("grid gap-4", selectedSegment === 0
            ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}>
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )
      )}

      {/* Content */}
      {!error && !loadingInitial && news.length > 0 && (
        isList ? (
          <div className="flex flex-col gap-2">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} variant="list" />
            ))}
          </div>
        ) : (
          <NewsCardGrid news={news} compact={selectedSegment === 0} />
        )
      )}

      {/* Sentinel + load-more indicator */}
      <div ref={sentinelRef} className="mt-8 flex justify-center">
        {loadingMore && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <Loader2 size={16} className="animate-spin" />
            Loading more…
          </div>
        )}
        {!loadingMore && !hasMore && news.length > 0 && (
          <p className="text-xs text-muted-foreground py-4">All {news.length} stories loaded</p>
        )}
      </div>
    </div>
  );
}
