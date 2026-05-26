"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import News from "@/types/News";
import NewsCardGrid from "@/components/NewsCard/NewsCardGrid";
import NewsCard from "@/components/NewsCard/NewsCard";
import SkeletonCard from "@/components/NewsCard/SkeletonCard";
import SegmentedControl from "@/components/SegmentedControl/SegmentedControl";
import { cn } from "@/lib/utils";

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

export default function NewsPage() {
  const searchParams = useSearchParams();
  const feedParam = searchParams.get("feed") as Feed | null;
  const initialFeed: Feed = feedParam && VALID_FEEDS.has(feedParam) ? feedParam : "topstories";

  const [activeFeed, setActiveFeed] = useState<Feed>(initialFeed);
  const [selectedSegment, setSelectedSegment] = useState(0);
  const [news, setNews] = useState<News[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchFeed = useCallback((feed: Feed) => {
    setLoading(true);
    setNews(null);
    setError(false);
    axios
      .get(`/api/news/?feed=${feed}`)
      .then((r) => {
        setNews(r.data.news);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchFeed(activeFeed);
  }, [activeFeed, fetchFeed]);

  const isList = LIST_FEEDS.includes(activeFeed);
  const activeTab = TABS.find((t) => t.id === activeFeed)!;

  return (
    <div className="max-w-screen-xl mx-auto px-6 md:px-12 lg:px-24 pt-10 pb-24">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-foreground">
          Browse News
        </h1>
        <p className="mt-2 text-muted-foreground text-base">
          {activeTab.description}
        </p>
      </div>

      {/* Feed tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-6 border-b border-border">
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

        {/* View toggle — only for card feeds */}
        {!isList && (
          <div className="ml-auto shrink-0">
            <SegmentedControl cb={(value) => setSelectedSegment(value)} />
          </div>
        )}
      </div>

      {/* Story count */}
      <p className="text-xs text-muted-foreground font-mono mb-4">
        {loading ? "Loading…" : news ? `${news.length} stories` : ""}
      </p>

      {/* Content */}
      {error ? (
        <div className="flex h-48 w-full justify-center items-center">
          <p className="text-muted-foreground">Failed to load. Please try again.</p>
        </div>
      ) : loading || !news ? (
        isList ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl shimmer-skeleton" />
            ))}
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-4",
              selectedSegment === 0
                ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )
      ) : isList ? (
        <div className="flex flex-col gap-2">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} variant="list" />
          ))}
        </div>
      ) : (
        <NewsCardGrid news={news} compact={selectedSegment === 0} />
      )}
    </div>
  );
}
