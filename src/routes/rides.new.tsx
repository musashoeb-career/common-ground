import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GridMap } from "@/components/GridMap";
import { CoordInput } from "@/components/CoordInput";
import { useStore } from "@/lib/store";
import type { Point } from "@/lib/overlap";

export const Route = createFileRoute("/rides/new")({
  head: () => ({
    meta: [
      { title: "Offer a ride — Commons rides" },
      { name: "description", content: "Drivers: share your pickup point, destination, departure time and seats." },
      { property: "og:title", content: "Offer a ride — Commons rides" },
      { property: "og:description", content: "Share your planned drive so riders can book a seat." },
    ],
  }),
  component: NewRide,
});

function NewRide() {
  const { addRide } = useStore();
  const navigate = useNavigate();
  const [driver, setDriver] = useState("");
  const [departAt, setDepartAt] = useState("");
  const [seats, setSeats] = useState(3);
  const [start, setStart] = useState<Point>();
  const [end, setEnd] = useState<Point>();

  const pick = (p: Point) => (!start || end ? (setStart(p), setEnd(undefined)) : setEnd(p));
  const valid = start && end && (start.x !== end.x || start.y !== end.y) && driver.trim() && departAt && seats >= 1;

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-5 pb-16 lg:grid-cols-[1fr_420px]">
      <section>
        <h1 className="font-display text-4xl md:text-5xl">Offer a ride</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Tap the map for your pickup point, then your destination. Your drive won't appear on the Super Map — only in the rides list.
        </p>
        <div className="mt-6">
          <GridMap segments={[]} draft={{ start, end }} onPick={pick} />
        </div>
      </section>
      <form
        className="space-y-5 self-start rounded-3xl bg-card p-6 shadow-soft"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          addRide({ driver: driver.trim(), departAt, seats, start: start!, end: end! });
          navigate({ to: "/rides" });
        }}
      >
        <label className="block font-semibold">Your name
          <input value={driver} onChange={(e) => setDriver(e.target.value)} placeholder="e.g. Priya"
            className="mt-2 w-full rounded-2xl bg-muted px-4 py-4 text-lg outline-none focus:ring-2 focus:ring-ring" />
        </label>
        <label className="block font-semibold">Departure time
          <input type="datetime-local" value={departAt} onChange={(e) => setDepartAt(e.target.value)}
            className="mt-2 w-full rounded-2xl bg-muted px-4 py-4 text-lg outline-none focus:ring-2 focus:ring-ring" />
        </label>
        <label className="block font-semibold">Seats in your car
          <input type="number" min={1} max={8} value={seats} onChange={(e) => setSeats(Math.max(1, Math.min(8, Math.round(Number(e.target.value) || 1))))}
            className="mt-2 w-full rounded-2xl bg-muted px-4 py-4 text-lg outline-none focus:ring-2 focus:ring-ring" />
        </label>
        <CoordInput label="Pickup point" value={start} onChange={setStart} tone="bg-accent" />
        <CoordInput label="Destination" value={end} onChange={setEnd} tone="bg-primary" />
        <button type="submit" disabled={!valid} className="btn-big w-full">Offer this ride</button>
      </form>
    </main>
  );
}
