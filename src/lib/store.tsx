import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Point } from "./overlap";

export const CATEGORIES = [
  { id: "medical", label: "Medical", emoji: "🏥" },
  { id: "work", label: "Work", emoji: "💼" },
  { id: "school", label: "School", emoji: "🎒" },
  { id: "leisure", label: "Leisure", emoji: "🌳" },
  { id: "errands", label: "Errands", emoji: "🛒" },
] as const;
export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type Route = { id: string; name: string; category: CategoryId; start: Point; end: Point };

const SEED: Route[] = [
  { id: "s1", name: "Amira", category: "work", start: { x: 2, y: 4 }, end: { x: 14, y: 4 } },
  { id: "s2", name: "Jon", category: "medical", start: { x: 4, y: 4 }, end: { x: 18, y: 4 } },
  { id: "s3", name: "Lee", category: "school", start: { x: 6, y: 4 }, end: { x: 12, y: 4 } },
  { id: "s4", name: "Rosa", category: "leisure", start: { x: 10, y: 2 }, end: { x: 10, y: 16 } },
  { id: "s5", name: "Sam", category: "errands", start: { x: 10, y: 8 }, end: { x: 10, y: 18 } },
  { id: "s6", name: "Dev", category: "work", start: { x: 3, y: 10 }, end: { x: 9, y: 16 } },
];

type Ctx = { routes: Route[]; addRoute: (r: Omit<Route, "id">) => void };
const StoreCtx = createContext<Ctx | null>(null);
const KEY = "commons-routes";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [routes, setRoutes] = useState<Route[]>(SEED);
  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setRoutes(JSON.parse(raw));
  }, []);
  const addRoute = (r: Omit<Route, "id">) =>
    setRoutes((prev) => {
      const next = [...prev, { ...r, id: crypto.randomUUID() }];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  return <StoreCtx.Provider value={{ routes, addRoute }}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("StoreProvider missing");
  return c;
}
