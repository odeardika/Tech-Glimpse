"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import axios from "axios";
import { MailX, CheckCircle, Loader2 } from "lucide-react";

function UnsubscribeContent(): React.ReactElement {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") ?? "";

  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async (): Promise<void> => {
    if (!email) return;
    setStatus("loading");
    setError(null);
    try {
      await axios.delete("/api/email/unsubscribe", { data: { email } });
      setStatus("done");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  if (status === "done") {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
          <CheckCircle size={28} className="text-accent" strokeWidth={1.5} />
        </div>
        <div className="space-y-1.5">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            You&apos;re unsubscribed
          </h1>
          <p className="text-sm text-muted-foreground">
            <span className="font-mono text-foreground">{email}</span> has been removed from our newsletter.
          </p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
        >
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
        <MailX size={28} className="text-destructive" strokeWidth={1.5} />
      </div>
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Unsubscribe?
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
          You&apos;re about to remove{" "}
          <span className="font-mono text-foreground">{email || "your email"}</span>{" "}
          from Tech Glimpse newsletter. You won&apos;t receive daily tech updates anymore.
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-3 mt-2">
        <button
          onClick={() => router.push("/")}
          disabled={status === "loading"}
          className="px-5 py-2.5 rounded-md text-sm font-medium border border-border hover:bg-muted text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={status === "loading" || !email}
          className="px-5 py-2.5 rounded-md text-sm font-medium bg-destructive text-white hover:bg-destructive/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
        >
          {status === "loading" && <Loader2 size={14} className="animate-spin" />}
          {status === "loading" ? "Unsubscribing…" : "Yes, unsubscribe"}
        </button>
      </div>
    </div>
  );
}

export default function UnsubscribePage(): React.ReactElement {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-10 shadow-sm">
        <Suspense fallback={<div className="text-muted-foreground text-sm text-center">Loading…</div>}>
          <UnsubscribeContent />
        </Suspense>
      </div>
    </main>
  );
}
