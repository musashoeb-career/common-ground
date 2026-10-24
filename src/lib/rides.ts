import type { Point } from "./overlap";

export type Ride = {
  id: string;
  driver: string;
  start: Point;
  end: Point;
  departAt: string; // value from a datetime-local input
  seats: number;
  booked: number;
};

export const SEED_RIDES: Ride[] = [
  { id: "r1", driver: "Priya", start: { x: 2, y: 3 }, end: { x: 15, y: 3 }, departAt: "2026-10-25T08:30", seats: 3, booked: 1 },
  { id: "r2", driver: "Marcus", start: { x: 5, y: 12 }, end: { x: 17, y: 16 }, departAt: "2026-10-25T09:15", seats: 4, booked: 0 },
  { id: "r3", driver: "Elena", start: { x: 8, y: 2 }, end: { x: 8, y: 18 }, departAt: "2026-10-25T17:45", seats: 2, booked: 2 },
  { id: "r4", driver: "Tom", start: { x: 1, y: 8 }, end: { x: 12, y: 14 }, departAt: "2026-10-26T07:00", seats: 5, booked: 1 },
];

export const seatsLeft = (r: Ride) => Math.max(0, r.seats - r.booked);
export const canBook = (r: Ride) => seatsLeft(r) > 0;
export const book = (r: Ride): Ride => (canBook(r) ? { ...r, booked: r.booked + 1 } : r);

export function formatDeparture(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
