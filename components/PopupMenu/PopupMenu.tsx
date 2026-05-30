"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Mail, Loader2 } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

interface PopupMenuProps {
  variant?: "primary" | "ghost";
  label?: string;
}

export default function PopupMenu({ variant = "primary", label = "Subscribe" }: PopupMenuProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [duplicate, setDuplicate] = useState(false);

  const handleSubscribe = async () => {
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

  return (
    <Dialog onOpenChange={() => { setSuccess(false); setDuplicate(false); }}>
      <DialogTrigger asChild>
        <button
          className={cn(
            "text-sm font-medium rounded-md px-4 py-2 transition-colors duration-120 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer",
            variant === "primary"
              ? "bg-accent text-accent-foreground hover:bg-accent/90"
              : "border border-border hover:bg-muted text-foreground"
          )}
        >
          {label}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[440px] p-8">
        <DialogHeader className="items-center text-center sm:text-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
            <Mail size={22} className="text-accent" strokeWidth={1.5} />
          </div>
          <div className="space-y-1.5">
            <DialogTitle className="font-display text-2xl font-bold tracking-tight">
              Stay in the loop
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
              Get the latest technology news delivered to your inbox every day. No spam, ever.
            </DialogDescription>
          </div>
        </DialogHeader>

        {success ? (
          <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/20 text-center">
            <p className="text-sm font-medium text-accent">You&apos;re subscribed!</p>
            <p className="text-xs text-muted-foreground mt-1">Welcome! Check your inbox for a hello from us.</p>
          </div>
        ) : (
          <form
            className="flex flex-col gap-3 mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubscribe();
            }}
          >
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-shadow text-sm"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent text-accent-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? "Subscribing…" : "Subscribe"}
            </button>
            {duplicate && (
              <p className="text-xs text-center text-muted-foreground">
                This email is already subscribed.
              </p>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
