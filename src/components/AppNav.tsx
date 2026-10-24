import { Link } from "@tanstack/react-router";
import { Map, Plus } from "lucide-react";

const items = [
  { to: "/", label: "Super Map", icon: Map },
  { to: "/routes/new", label: "Add my route", icon: Plus },
] as const;

export function AppNav() {
  return (
    <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6">
      <Link to="/" className="font-display text-3xl text-foreground">Commons<span className="text-accent">.</span></Link>
      <nav className="flex gap-2 rounded-full bg-card p-1.5 shadow-soft">
        {items.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: true }}
            className="flex items-center gap-2 rounded-full px-5 py-3 text-base font-semibold text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "bg-primary text-primary-foreground hover:text-primary-foreground" }}
          >
            <Icon className="size-5" /> {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
