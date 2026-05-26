"use client";

import { useState } from "react";
import { LayoutGrid, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";

interface SegmentedControlProps {
  cb: (value: number) => void;
}

export default function SegmentedControl({ cb }: SegmentedControlProps) {
  const [selected, setSelected] = useState(1);

  const select = (value: number) => {
    setSelected(value);
    cb(value);
  };

  return (
    <div className="flex justify-end px-0 py-4">
      <div className="inline-flex bg-muted p-1 rounded-full gap-0.5">
        <button
          onClick={() => select(0)}
          aria-label="Compact view"
          aria-pressed={selected === 0}
          className={cn(
            "flex items-center justify-center px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            selected === 0
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LayoutGrid size={18} strokeWidth={1.5} />
        </button>
        <button
          onClick={() => select(1)}
          aria-label="Expanded view"
          aria-pressed={selected === 1}
          className={cn(
            "flex items-center justify-center px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            selected === 1
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LayoutList size={18} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
