import { createFileRoute, Link } from "@tanstack/react-router";
import { Accessibility, Clock, Pill, StickyNote, Users } from "lucide-react";
import { GridMap } from "@/components/GridMap";
import { useStore } from "@/lib/store";
import { canBook, formatDeparture, seatsLeft } from "@/lib/rides";

export const Route = createFileRoute("/rides/$rideId")({
  head: () => ({
    meta: [
      { title: "Ride details — Commons rides" },
      { name: "description", content: "See the driver's planned route and book a seat." },
      { property: "og:title", content: "Ride details — Commons rides" },
      { property: "og:description", content: "See the driver's planned route and book a seat." },
    ],
  }),
  component: RideDetail,
});

function RideDetail() {
  const { rideId } = Route.useParams();
  const { rides, bookRide, profile } = useStore();
  const ride = rides.find((r) => r.id === rideId);

  if (!ride) {
    return (
      <main className="mx-auto max-w-2xl px-5 pb-16 text-center">
        <h1 className="font-display text-4xl">Ride not found</h1>
        <p className="mt-2 text-lg text-muted-foreground">This ride may have been removed.</p>
        <Link to="/rides" className="btn-big mt-6 inline-flex">Back to rides</Link>
      </main>
    );
  }

  const left = seatsLeft(ride);
  const hasProfile = profile.name.trim().length > 0;

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-5 pb-16 lg:grid-cols-[1fr_420px]">
      <section>
        <h1 className="font-display text-4xl md:text-5xl">{ride.driver}'s ride</h1>
        <p className="mt-2 text-lg text-muted-foreground">The driver's planned route, from pickup to destination.</p>
        <div className="mt-6">
          <GridMap segments={[{ a: ride.start, b: ride.end }]} />
        </div>
      </section>
      <aside className="space-y-5 self-start">
        <div className="rounded-3xl bg-card p-6 shadow-soft">
          <div className="flex items-start justify-between gap-4">
            <div className="text-xl font-semibold">
              ({ride.start.x}, {ride.start.y}) → ({ride.end.x}, {ride.end.y})
            </div>
            <span className={`rounded-full px-4 py-1.5 text-sm font-bold ${left > 0 ? "bg-muted text-foreground" : "bg-destructive text-destructive-foreground"}`}>
              {left > 0 ? `${left} of ${ride.seats} seats left` : "Full"}
            </span>
          </div>
          <div className="mt-4 space-y-2 text-muted-foreground">
            <div className="flex items-center gap-2"><Clock className="size-4" />Departs {formatDeparture(ride.departAt)}</div>
            <div className="flex items-center gap-2"><Users className="size-4" />{ride.seats} seats total · {ride.booked} booked</div>
          </div>
          <button
            type="button"
            disabled={!canBook(ride)}
            onClick={() => bookRide(ride.id)}
            className="btn-big mt-5 w-full"
          >
            {canBook(ride) ? "Book a seat" : "Fully booked"}
          </button>
        </div>

        <div className="rounded-3xl bg-card p-6 shadow-soft">
          <h2 className="text-lg font-semibold">What the driver knows about you</h2>
          {hasProfile ? (
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Accessibility className="size-4" />
                {profile.wheelchair ? "Uses a wheelchair or mobility aid" : "No mobility aid needed"}
              </li>
              {profile.medication.trim() && (
                <li className="flex items-center gap-2"><Pill className="size-4" />{profile.medication}</li>
              )}
              {profile.notes.trim() && (
                <li className="flex items-start gap-2"><StickyNote className="mt-1 size-4" />{profile.notes}</li>
              )}
            </ul>
          ) : (
            <p className="mt-3 text-muted-foreground">
              You haven't filled in your profile yet.{" "}
              <Link to="/profile" className="font-semibold text-primary underline">Add your details</Link>{" "}
              so drivers know about accessibility or medication needs.
            </p>
          )}
        </div>
      </aside>
    </main>
  );
}
