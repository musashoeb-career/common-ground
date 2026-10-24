import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { canBook, formatDeparture, seatsLeft } from "@/lib/rides";

export const Route = createFileRoute("/rides/")({
  head: () => ({
    meta: [
      { title: "Available rides — Commons rides" },
      { name: "description", content: "Browse rides offered by drivers and book a seat." },
      { property: "og:title", content: "Available rides — Commons rides" },
      { property: "og:description", content: "Browse rides offered by drivers and book a seat." },
    ],
  }),
  component: RidesPage,
});

function RidesPage() {
  const { rides, bookRide } = useStore();
  return (
    <main className="mx-auto max-w-6xl px-5 pb-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl md:text-5xl">Available rides</h1>
          <p className="mt-2 text-lg text-muted-foreground">Drivers offering seats. Book one before it fills up.</p>
        </div>
        <Link to="/rides/new" className="btn-big">+ Offer a ride</Link>
      </div>

      {rides.length === 0 ? (
        <p className="mt-10 rounded-3xl bg-card p-8 text-center text-lg text-muted-foreground shadow-soft">
          No rides yet — be the first driver to offer one.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {rides.map((r) => {
            const left = seatsLeft(r);
            return (
              <li key={r.id} className="rounded-3xl bg-card p-6 shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xl font-semibold">{r.driver}</div>
                    <div className="mt-1 text-muted-foreground">
                      ({r.start.x}, {r.start.y}) → ({r.end.x}, {r.end.y})
                    </div>
                  </div>
                  <span className={`rounded-full px-4 py-1.5 text-sm font-bold ${left > 0 ? "bg-muted text-foreground" : "bg-destructive text-destructive-foreground"}`}>
                    {left > 0 ? `${left} of ${r.seats} seats left` : "Full"}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-2"><Clock className="size-4" />{formatDeparture(r.departAt)}</span>
                  <span className="flex items-center gap-2"><Users className="size-4" />{r.seats} seats</span>
                </div>
                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    disabled={!canBook(r)}
                    onClick={() => bookRide(r.id)}
                    className="btn-big flex-1"
                  >
                    {canBook(r) ? "Book a seat" : "Fully booked"}
                  </button>
                  <Link
                    to="/rides/$rideId"
                    params={{ rideId: r.id }}
                    className="flex items-center gap-2 rounded-full bg-muted px-6 py-4 font-bold text-foreground transition-colors hover:bg-secondary"
                  >
                    Details <ArrowRight className="size-5" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
