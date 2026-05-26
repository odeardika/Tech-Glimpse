"use client";

import { useEffect, useRef } from "react";
import News from "@/types/News";
import NewsCard from "./NewsCard";
import { cn } from "@/lib/utils";

interface NewsCardGridProps {
  news: News[];
  compact?: boolean;
}

export default function NewsCardGrid({ news, compact = true }: NewsCardGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-card]");
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            entry.target.classList.add("animate-fade-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [news]);

  return (
    <div
      ref={gridRef}
      className={cn(
        "grid gap-4",
        compact
          ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {news.map((item, index) => (
        <div
          key={item.id}
          data-card
          style={{ opacity: 0, animationDelay: `${index * 50}ms` }}
          className="flex flex-col"
        >
          <NewsCard news={item} />
        </div>
      ))}
    </div>
  );
}
