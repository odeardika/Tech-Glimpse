"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import News from "@/types/News";
import { cn } from "@/lib/utils";
import { ArrowUp, MessageSquare, Clock } from "lucide-react";

interface NewsCardProps {
  news: News;
  className?: string;
  variant?: "card" | "list";
}

interface EnrichedMeta {
  image: string | null;
  description: string | null;
  favicon: string | null;
}

function formatTime(unix?: number): string {
  if (!unix) return "";
  const diff = Math.floor((Date.now() / 1000 - unix) / 60);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

function typeLabel(type: News["type"]): string {
  if (type === "job") return "Job";
  if (type === "ask") return "Ask HN";
  if (type === "show") return "Show HN";
  return "Tech";
}

function useEnrichedMeta(news: News): EnrichedMeta {
  const [meta, setMeta] = useState<EnrichedMeta>({
    image: news.image,
    description: news.description,
    favicon: news.favicon,
  });

  useEffect(() => {
    if (news.image || !news.url || news.type === "job" || news.type === "ask") return;

    let cancelled = false;
    fetch(`/api/news/meta?url=${encodeURIComponent(news.url)}`)
      .then((r) => r.json())
      .then((data: EnrichedMeta) => {
        if (!cancelled) setMeta(data);
      })
      .catch(() => {/* silent */});

    return () => { cancelled = true; };
  }, [news.id, news.url, news.image, news.type]);

  return meta;
}

function CardVariant({ news, className }: { news: News; className?: string }) {
  const meta = useEnrichedMeta(news);
  const imagePreview = meta.image ?? meta.favicon ?? null;
  const hasImage = !!imagePreview;

  return (
    <Link
      href={news.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex flex-col rounded-xl border border-border bg-card overflow-hidden",
        "shadow-sm hover:shadow-lg hover:border-accent/30",
        "transition-all duration-200 ease-out hover:-translate-y-0.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-full",
        className
      )}
    >
      {/* Image */}
      <div className="aspect-video overflow-hidden relative bg-muted shrink-0">
        {hasImage ? (
          <Image
            src={imagePreview}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 dark:brightness-85"
            unoptimized
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          /* Placeholder: shimmer + centered category label */
          <div className="w-full h-full shimmer-skeleton flex items-center justify-center">
            <span className="text-xs font-mono font-medium text-muted-foreground/50 uppercase tracking-widest select-none">
              {typeLabel(news.type)}
            </span>
          </div>
        )}

        {/* Category badge — overlaid on image bottom-left */}
        {hasImage && (
          <div className="absolute bottom-2.5 left-2.5">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm text-accent border border-accent/20">
              {typeLabel(news.type)}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2.5 p-4 flex-1 min-h-0 overflow-hidden">
        {/* Category badge when no image */}
        {!hasImage && (
          <span className="self-start text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full text-accent bg-accent/10 border border-accent/20">
            {typeLabel(news.type)}
          </span>
        )}

        <h3 className="font-display font-bold text-sm leading-snug line-clamp-2 text-foreground group-hover:text-accent transition-colors duration-150">
          {news.title}
        </h3>

        {meta.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1 overflow-hidden">
            {meta.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 pt-1 mt-auto border-t border-border/60">
          {news.score !== undefined && (
            <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
              <ArrowUp size={12} strokeWidth={2.5} className="text-accent" />
              {news.score}
            </span>
          )}
          {news.descendants !== undefined && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MessageSquare size={11} strokeWidth={1.5} />
              {news.descendants}
            </span>
          )}
          {news.time && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto font-mono">
              <Clock size={10} strokeWidth={1.5} />
              {formatTime(news.time)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function ListVariant({ news, className }: { news: News; className?: string }) {
  return (
    <Link
      href={news.url || `https://news.ycombinator.com/item?id=${news.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-start gap-4 px-4 py-3.5 rounded-xl border border-border bg-card",
        "hover:border-accent/30 hover:shadow-sm hover:bg-accent/2",
        "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      {/* Score column */}
      <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5 min-w-9 text-center">
        <ArrowUp size={13} strokeWidth={2.5} className="text-accent" />
        <span className="text-xs font-bold font-mono text-foreground leading-none">{news.score ?? 0}</span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <h3 className="font-medium text-sm leading-snug line-clamp-2 text-foreground group-hover:text-accent transition-colors duration-150">
          {news.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono flex-wrap">
          {news.by && (
            <span className="font-medium text-foreground/70">{news.by}</span>
          )}
          {news.descendants !== undefined && (
            <span className="flex items-center gap-1">
              <MessageSquare size={10} strokeWidth={1.5} />
              {news.descendants}
            </span>
          )}
          {news.time && (
            <span className="flex items-center gap-1 ml-auto shrink-0">
              <Clock size={10} strokeWidth={1.5} />
              {formatTime(news.time)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function NewsCard({ news, className, variant = "card" }: NewsCardProps) {
  if (variant === "list") return <ListVariant news={news} className={className} />;
  return <CardVariant news={news} className={className} />;
}
