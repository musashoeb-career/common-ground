import { computeOverlaps, type Point, type Segment } from "@/lib/overlap";

export const GRID = 20;
const PAD = 1;

type Props = {
  segments: Segment[];
  draft?: { start?: Point | undefined; end?: Point | undefined };
  onPick?: (p: Point) => void;
  markers?: Point[];
};

export function GridMap({ segments, draft, onPick, markers = [] }: Props) {
  const pieces = computeOverlaps(segments);
  const max = Math.max(1, ...pieces.map((p) => p.count));
  // SVG y goes down; flip so (0,0) is bottom-left
  const fy = (y: number) => GRID - y;

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onPick) return;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const loc = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    const x = Math.round(loc.x);
    const y = Math.round(GRID - loc.y);
    if (x < 0 || y < 0 || x > GRID || y > GRID) return;
    onPick({ x, y });
  };

  const ticks = Array.from({ length: GRID + 1 }, (_, i) => i);

  return (
    <svg
      viewBox={`${-PAD} ${-PAD} ${GRID + PAD * 2} ${GRID + PAD * 2}`}
      className={`w-full h-auto rounded-3xl bg-card shadow-soft ${onPick ? "cursor-crosshair" : ""}`}
      onClick={handleClick}
      role="img"
      aria-label="Route map grid"
    >
      {ticks.map((i) => (
        <g key={i}>
          <line x1={i} y1={0} x2={i} y2={GRID} className="stroke-grid" strokeWidth={i % 5 === 0 ? 0.06 : 0.025} />
          <line x1={0} y1={i} x2={GRID} y2={i} className="stroke-grid" strokeWidth={i % 5 === 0 ? 0.06 : 0.025} />
          {i % 5 === 0 && (
            <>
              <text x={i} y={GRID + 0.75} fontSize={0.45} textAnchor="middle" className="fill-muted-foreground">{i}</text>
              <text x={-0.5} y={fy(i) + 0.15} fontSize={0.45} textAnchor="middle" className="fill-muted-foreground">{i}</text>
            </>
          )}
        </g>
      ))}

      {pieces.map((p, i) => {
        const t = (p.count - 1) / Math.max(1, max - 1);
        return (
          <line
            key={i}
            x1={p.a.x} y1={fy(p.a.y)} x2={p.b.x} y2={fy(p.b.y)}
            strokeWidth={0.14 + (p.count - 1) * 0.16}
            strokeLinecap="round"
            style={{ stroke: `color-mix(in oklab, var(--heat-high) ${Math.round(t * 100)}%, var(--heat-low))` }}
          />
        );
      })}

      {segments.flatMap((s, i) => [s.a, s.b].map((p, j) => (
        <circle key={`${i}-${j}`} cx={p.x} cy={fy(p.y)} r={0.18} className="fill-card stroke-primary" strokeWidth={0.07} />
      )))}

      {markers.map((p, i) => (
        <circle key={`m${i}`} cx={p.x} cy={fy(p.y)} r={0.3} className="fill-accent" />
      ))}

      {draft?.start && draft?.end && (
        <line x1={draft.start.x} y1={fy(draft.start.y)} x2={draft.end.x} y2={fy(draft.end.y)}
          className="stroke-accent" strokeWidth={0.16} strokeDasharray="0.4 0.25" strokeLinecap="round" />
      )}
      {draft?.start && <circle cx={draft.start.x} cy={fy(draft.start.y)} r={0.38} className="fill-accent" />}
      {draft?.end && <circle cx={draft.end.x} cy={fy(draft.end.y)} r={0.38} className="fill-primary" />}
    </svg>
  );
}
