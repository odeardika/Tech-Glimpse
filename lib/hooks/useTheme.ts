"use client";

import { useState, useEffect, useCallback } from "react";

export function useTheme(): { isDark: boolean; toggle: () => void } {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "theme") {
        const dark = e.newValue === "dark";
        setIsDark(dark);
        document.documentElement.classList.toggle("dark", dark);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggle = useCallback(() => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, [isDark]);

  return { isDark, toggle };
}
