import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Point } from "./overlap";
import { SEED_RIDES, book, type Ride } from "./rides";

export const CATEGORIES = [
  { id: "medical", label: "Medical", emoji: "🏥" },
  { id: "work", label: "Work", emoji: "💼" },
  { id: "school", label: "School", emoji: "🎒" },
  { id: "leisure", label: "Leisure", emoji: "🌳" },
  { id: "errands", label: "Errands", emoji: "🛒" },
] as const;
export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type Route = { id: string; name: string; category: CategoryId; start: Point; end: Point };

export type Profile = {
  name: string;
  wheelchair: boolean;
  medication: string;
  notes: string;
};
const EMPTY_PROFILE: Profile = { name: "", wheelchair: false, medication: "", notes: "" };

const SEED: Route[] = [
  { id: "s1", name: "Amira", category: "work", start: { x: 2, y: 4 }, end: { x: 14, y: 4 } },
  { id: "s2", name: "Jon", category: "medical", start: { x: 4, y: 4 }, end: { x: 18, y: 4 } },
  { id: "s3", name: "Lee", category: "school", start: { x: 6, y: 4 }, end: { x: 12, y: 4 } },
  { id: "s4", name: "Rosa", category: "leisure", start: { x: 10, y: 2 }, end: { x: 10, y: 16 } },
  { id: "s5", name: "Sam", category: "errands", start: { x: 10, y: 8 }, end: { x: 10, y: 18 } },
  { id: "s6", name: "Dev", category: "work", start: { x: 3, y: 10 }, end: { x: 9, y: 16 } },
];

type Ctx = {
  routes: Route[];
  addRoute: (r: Omit<Route, "id">) => void;
  rides: Ride[];
  addRide: (r: Omit<Ride, "id" | "booked">) => void;
  bookRide: (id: string) => void;
  profile: Profile;
  saveProfile: (p: Profile) => void;
};
const StoreCtx = createContext<Ctx | null>(null);
const KEY = "commons-routes";
const RIDES_KEY = "commons-rides";
const PROFILE_KEY = "commons-profile";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [routes, setRoutes] = useState<Route[]>(SEED);
  const [rides, setRides] = useState<Ride[]>(SEED_RIDES);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setRoutes(JSON.parse(raw));
    const rawRides = localStorage.getItem(RIDES_KEY);
    if (rawRides) setRides(JSON.parse(rawRides));
    const rawProfile = localStorage.getItem(PROFILE_KEY);
    if (rawProfile) setProfile(JSON.parse(rawProfile));
  }, []);

  const addRoute = (r: Omit<Route, "id">) =>
    setRoutes((prev) => {
      const next = [...prev, { ...r, id: crypto.randomUUID() }];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });

  const addRide = (r: Omit<Ride, "id" | "booked">) =>
    setRides((prev) => {
      const next = [...prev, { ...r, id: crypto.randomUUID(), booked: 0 }];
      localStorage.setItem(RIDES_KEY, JSON.stringify(next));
      return next;
    });

  const bookRide = (id: string) =>
    setRides((prev) => {
      const next = prev.map((r) => (r.id === id ? book(r) : r));
      localStorage.setItem(RIDES_KEY, JSON.stringify(next));
      return next;
    });

  const saveProfile = (p: Profile) => {
    setProfile(p);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  };

  return (
    <StoreCtx.Provider value={{ routes, addRoute, rides, addRide, bookRide, profile, saveProfile }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("StoreProvider missing");
  return c;
}
