"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { readStreak, touchStreak, type StreakState } from "@/lib/streak";

export function StreakBadge() {
  const [state, setState] = useState<StreakState | null>(null);

  useEffect(() => {
    // Touch the streak on first nav render. Idempotent within a calendar day.
    setState(touchStreak());
    // Refresh from storage if another tab updates it.
    function onStorage() {
      setState(readStreak());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!state || state.current < 1) return null;

  const days = state.current;
  return (
    <span
      className="hidden items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/15 px-2 py-0.5 text-[11px] font-semibold text-amber-200 sm:inline-flex"
      title={`${days}-day streak · longest ${state.longest} days · ${state.totalFixes} total prompts improved`}
    >
      <Flame className="h-3 w-3" />
      {days}d streak
    </span>
  );
}
