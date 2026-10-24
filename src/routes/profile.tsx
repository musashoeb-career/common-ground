import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Accessibility, Check, Pill, StickyNote } from "lucide-react";
import { useStore, type Profile } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Commons rides" },
      { name: "description", content: "Share accessibility and medication needs so drivers can prepare." },
      { property: "og:title", content: "Your profile — Commons rides" },
      { property: "og:description", content: "Share accessibility and medication needs so drivers can prepare." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, saveProfile } = useStore();
  const [draft, setDraft] = useState<Profile>(profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => setDraft(profile), [profile]);

  const inputCls = "mt-2 w-full rounded-2xl bg-muted px-4 py-4 text-lg outline-none focus:ring-2 focus:ring-ring";

  return (
    <main className="mx-auto max-w-2xl px-5 pb-16">
      <h1 className="font-display text-4xl md:text-5xl">Your profile</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        This is what a driver sees when you book — anything that helps them get you there safely.
      </p>

      <form
        className="mt-8 space-y-5 rounded-3xl bg-card p-6 shadow-soft"
        onSubmit={(e) => {
          e.preventDefault();
          saveProfile(draft);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }}
      >
        <label className="block font-semibold">Your name
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Maria"
            className={inputCls} />
        </label>

        <button
          type="button"
          onClick={() => setDraft({ ...draft, wheelchair: !draft.wheelchair })}
          className={`chip w-full ${draft.wheelchair ? "chip-active" : ""}`}
          aria-pressed={draft.wheelchair}
        >
          <Accessibility className="size-6" />
          <span className="flex-1 text-left">I use a wheelchair or mobility aid</span>
          {draft.wheelchair && <Check className="size-5" />}
        </button>

        <label className="block font-semibold">
          <span className="flex items-center gap-2"><Pill className="size-5" />Medication I need to keep with me</span>
          <input value={draft.medication} onChange={(e) => setDraft({ ...draft, medication: e.target.value })}
            placeholder="e.g. Insulin — needs to stay cool" className={inputCls} />
        </label>

        <label className="block font-semibold">
          <span className="flex items-center gap-2"><StickyNote className="size-5" />Anything else the driver should know</span>
          <textarea value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            placeholder="e.g. I need a few extra minutes to get in the car; please don't play loud music."
            rows={4} className={`${inputCls} resize-none`} />
        </label>

        <button type="submit" className="btn-big w-full">
          {saved ? "Saved ✓" : "Save my profile"}
        </button>
      </form>
    </main>
  );
}
