import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GridMap, GRID } from "@/components/GridMap";
import { CATEGORIES, useStore, type CategoryId } from "@/lib/store";
import type { Point } from "@/lib/overlap";

export const Route = createFileRoute("/routes/new")({
  head: () => ({
    meta: [
      { title: "Add your route — Commons rides" },
      { name: "description", content: "Share where you start and where you need to go." },
      { property: "og:title", content: "Add your route — Commons rides" },
      { property: "og:description", content: "Share your trip so drivers can serve it." },
    ],
  }),
  component: NewRoute,
});

function CoordInput({ label, value, onChange, tone }: { label: string; value?: Point; onChange: (p: Point) => void; tone: string }) {
  const set = (k: "x" | "y", v: string) => {
    const n = Math.max(0, Math.min(GRID, Math.round(Number(v) || 0)));
    onChange({ x: value?.x ?? 0, y: value?.y ?? 0, [k]: n });
  };
  return (
    <div className="rounded-3xl bg-muted p-4">
      <div className="mb-2 flex items-center gap-2 font-semibold"><span className={`size-4 rounded-full ${tone}`} />{label}</div>
      <div className="flex gap-3">
        {(["x", "y"] as const).map((k) => (
          <label key={k} className="flex-1 text-sm text-muted-foreground">
            {k.toUpperCase()}
            <input type="number" min={0} max={GRID} value={value?.[k] ?? ""} onChange={(e) => set(k, e.target.value)}
              className="mt-1 w-full rounded-2xl border-0 bg-card px-4 py-3 text-xl font-semibold text-foreground shadow-soft outline-none focus:ring-2 focus:ring-ring" />
          </label>
        ))}
      </div>
    </div>
  );
}

function NewRoute() {
  const { routes, addRoute } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryId>("work");
  const [start, setStart] = useState<Point>();
  const [end, setEnd] = useState<Point>();

  const pick = (p: Point) => (!start || end ? (setStart(p), setEnd(undefined)) : setEnd(p));
  const valid = start && end && (start.x !== end.x || start.y !== end.y) && name.trim();

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-5 pb-16 lg:grid-cols-[1fr_420px]">
      <section>
        <h1 className="font-display text-4xl md:text-5xl">Add your route</h1>
        <p className="mt-2 text-lg text-muted-foreground">Tap the map for your start, then your destination — or type the numbers.</p>
        <div className="mt-6">
          <GridMap segments={routes.map((r) => ({ a: r.start, b: r.end }))} draft={{ start, end }} onPick={pick} />
        </div>
      </section>
      <form
        className="space-y-5 self-start rounded-3xl bg-card p-6 shadow-soft"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          addRoute({ name: name.trim(), category, start: start!, end: end! });
          navigate({ to: "/" });
        }}
      >
        <label className="block font-semibold">Your name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Maria"
            className="mt-2 w-full rounded-2xl bg-muted px-4 py-4 text-lg outline-none focus:ring-2 focus:ring-ring" />
        </label>
        <div>
          <div className="mb-2 font-semibold">What's the trip for?</div>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => (
              <button type="button" key={c.id} onClick={() => setCategory(c.id)}
                className={`chip ${category === c.id ? "chip-active" : ""}`}>
                <span className="text-xl">{c.emoji}</span>{c.label}
              </button>
            ))}
          </div>
        </div>
        <CoordInput label="Starting point" value={start} onChange={setStart} tone="bg-accent" />
        <CoordInput label="Destination" value={end} onChange={setEnd} tone="bg-primary" />
        <button type="submit" disabled={!valid} className="btn-big w-full">Share my route</button>
      </form>
    </main>
  );
}
