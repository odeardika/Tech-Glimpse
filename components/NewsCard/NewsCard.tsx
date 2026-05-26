import React from "react";
import Image from "next/image";
import Link from "next/link";
import News from "@/types/News";
import { cn } from "@/lib/utils";
import { ArrowUp, MessageSquare, User } from "lucide-react";

interface NewsCardProps {
  news: News;
  className?: string;
  variant?: "card" | "list";
}

function formatTime(unix?: number): string {
  if (!unix) return "";
  const diff = Math.floor((Date.now() / 1000 - unix) / 60);
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

function MetaRow({ news }: { news: News }) {
  return (
    <div className="flex items-center gap-3 mt-auto pt-2 text-xs text-muted-foreground font-mono">
      {news.score !== undefined && (
        <span className="flex items-center gap-1">
          <ArrowUp size={11} strokeWidth={2} className="text-accent" />
          {news.score}
        </span>
      )}
      {news.descendants !== undefined && (
        <span className="flex items-center gap-1">
          <MessageSquare size={11} strokeWidth={1.5} />
          {news.descendants}
        </span>
      )}
      {news.by && (
        <span className="flex items-center gap-1 truncate">
          <User size={11} strokeWidth={1.5} />
          {news.by}
        </span>
      )}
      {news.time && (
        <span className="ml-auto shrink-0">{formatTime(news.time)}</span>
      )}
    </div>
  );
}

function CardVariant({ news, className }: { news: News; className?: string }) {
  const imagePreview = news.image ?? news.favicon ?? "/placeholder.png";

  return (
    <Link
      href={news.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex flex-col rounded-xl border border-border bg-card overflow-hidden card-hover shadow-xs hover:shadow-md hover:border-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-full",
        className
      )}
    >
      <div className="aspect-video overflow-hidden relative bg-muted shrink-0">
        <Image
          src={imagePreview}
          alt={news.title}
          fill
          className="object-cover transition-transform duration-400 group-hover:scale-[1.03] dark:brightness-90"
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1">
        <span className="inline-block self-start text-xs font-medium uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 rounded-full px-2.5 py-0.5">
          {news.type === "job" ? "Job" : news.type === "ask" ? "Ask HN" : news.type === "show" ? "Show HN" : "Tech"}
        </span>
        <h3 className="font-semibold text-base leading-snug line-clamp-2 text-foreground group-hover:text-accent transition-colors">
          {news.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
          {news.description ?? news.title}
        </p>
        <MetaRow news={news} />
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
        "group flex items-start gap-4 p-4 rounded-xl border border-border bg-card hover:border-accent/20 hover:shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5 min-w-[36px]">
        <ArrowUp size={14} strokeWidth={2} className="text-accent" />
        <span className="text-xs font-mono font-medium text-foreground">{news.score ?? 0}</span>
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <h3 className="font-medium text-sm leading-snug line-clamp-2 text-foreground group-hover:text-accent transition-colors">
          {news.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
          {news.by && <span className="flex items-center gap-1"><User size={10} strokeWidth={1.5} />{news.by}</span>}
          {news.descendants !== undefined && (
            <span className="flex items-center gap-1"><MessageSquare size={10} strokeWidth={1.5} />{news.descendants} comments</span>
          )}
          {news.time && <span className="ml-auto shrink-0">{formatTime(news.time)}</span>}
        </div>
      </div>
    </Link>
  );
}

export default function NewsCard({ news, className, variant = "card" }: NewsCardProps) {
  if (variant === "list") return <ListVariant news={news} className={className} />;
  return <CardVariant news={news} className={className} />;
}
