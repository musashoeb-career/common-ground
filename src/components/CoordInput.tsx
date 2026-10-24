import { GRID } from "./GridMap";
import type { Point } from "@/lib/overlap";

export function CoordInput({ label, value, onChange, tone }: { label: string; value?: Point | undefined; onChange: (p: Point) => void; tone: string }) {
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
