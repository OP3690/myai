"use client";

const STREAK_KEY = "fixaiprompt.streak";

type StreakState = {
  current: number; // consecutive day count
  longest: number;
  lastVisit: string | null; // YYYY-MM-DD (local)
  totalFixes: number;
};

function today(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function read(): StreakState {
  if (typeof window === "undefined") {
    return { current: 0, longest: 0, lastVisit: null, totalFixes: 0 };
  }
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { current: 0, longest: 0, lastVisit: null, totalFixes: 0 };
    const p = JSON.parse(raw);
    return {
      current: Number(p.current) || 0,
      longest: Number(p.longest) || 0,
      lastVisit: p.lastVisit || null,
      totalFixes: Number(p.totalFixes) || 0,
    };
  } catch {
    return { current: 0, longest: 0, lastVisit: null, totalFixes: 0 };
  }
}

function write(state: StreakState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(state));
  } catch {}
}

/** Touch the streak — called on any meaningful action. Idempotent within a day. */
export function touchStreak(): StreakState {
  if (typeof window === "undefined") {
    return { current: 0, longest: 0, lastVisit: null, totalFixes: 0 };
  }
  const cur = read();
  const t = today();
  if (cur.lastVisit === t) return cur;
  let nextCurrent = 1;
  if (cur.lastVisit === yesterday()) {
    nextCurrent = cur.current + 1;
  }
  const next: StreakState = {
    current: nextCurrent,
    longest: Math.max(cur.longest, nextCurrent),
    lastVisit: t,
    totalFixes: cur.totalFixes,
  };
  write(next);
  return next;
}

export function incrementFixes(): StreakState {
  if (typeof window === "undefined") {
    return { current: 0, longest: 0, lastVisit: null, totalFixes: 0 };
  }
  const cur = read();
  const next: StreakState = {
    ...cur,
    totalFixes: cur.totalFixes + 1,
  };
  write(next);
  return next;
}

export function readStreak(): StreakState {
  return read();
}

export type { StreakState };
