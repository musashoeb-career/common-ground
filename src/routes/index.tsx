import { createFileRoute, Link } from "@tanstack/react-router";
import { GridMap } from "@/components/GridMap";
import { CATEGORIES, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Super Map — Commons rides" },
      { name: "description", content: "See where your community wants to travel, and where routes overlap." },
      { property: "og:title", content: "Super Map — Commons rides" },
      { property: "og:description", content: "Crowdsourced travel routes, plotted together." },
    ],
  }),
  component: SuperMap,
});

function SuperMap() {
  const { routes } = useStore();
  const cat = (id: string) => CATEGORIES.find((c) => c.id === id)!;
  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-5 pb-16 lg:grid-cols-[1fr_340px]">
      <section>
        <h1 className="font-display text-4xl md:text-5xl">Where people want to go</h1>
        <p className="mt-2 text-lg text-muted-foreground">Thicker, warmer lines mean more people share that stretch.</p>
        <div className="mt-6"><GridMap segments={routes.map((r) => ({ a: r.start, b: r.end }))} /></div>
        <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
          <span>1 person</span>
          <span className="h-3 w-40 rounded-full bg-heat-scale" />
          <span>many people</span>
        </div>
      </section>
      <aside className="space-y-4">
        <Link to="/routes/new" className="btn-big w-full">+ Add my route</Link>
        <div className="rounded-3xl bg-card p-5 shadow-soft">
          <h2 className="mb-3 text-lg font-semibold">{routes.length} routes shared</h2>
          <ul className="max-h-[480px] space-y-2 overflow-auto">
            {routes.map((r) => (
              <li key={r.id} className="flex items-center gap-3 rounded-2xl bg-muted p-3">
                <span className="text-2xl">{cat(r.category).emoji}</span>
                <div className="text-sm">
                  <div className="font-semibold">{r.name} · {cat(r.category).label}</div>
                  <div className="text-muted-foreground">({r.start.x}, {r.start.y}) → ({r.end.x}, {r.end.y})</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </main>
  );
}
