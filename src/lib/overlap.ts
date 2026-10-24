export type Point = { x: number; y: number };
export type Segment = { a: Point; b: Point };
export type Piece = { a: Point; b: Point; count: number };

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

/** Splits all segments into pieces, each tagged with how many routes cover it. */
export function computeOverlaps(segments: Segment[]): Piece[] {
  const groups = new Map<string, { dir: Point; base: Point; spans: [number, number][] }>();
  for (const { a, b } of segments) {
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    if (dx === 0 && dy === 0) continue;
    const g = gcd(dx, dy);
    dx /= g;
    dy /= g;
    if (dx < 0 || (dx === 0 && dy < 0)) {
      dx = -dx;
      dy = -dy;
    }
    const offset = dx * a.y - dy * a.x;
    const key = `${dx},${dy},${offset}`;
    if (!groups.has(key)) groups.set(key, { dir: { x: dx, y: dy }, base: a, spans: [] });
    const grp = groups.get(key)!;
    const len2 = dx * dx + dy * dy;
    const t = (p: Point) => ((p.x - grp.base.x) * dx + (p.y - grp.base.y) * dy) / len2;
    const ta = t(a);
    const tb = t(b);
    grp.spans.push([Math.min(ta, tb), Math.max(ta, tb)]);
  }
  const pieces: Piece[] = [];
  for (const { dir, base, spans } of groups.values()) {
    const cuts = [...new Set(spans.flat())].sort((m, n) => m - n);
    for (let i = 0; i < cuts.length - 1; i++) {
      const s = cuts[i];
      const e = cuts[i + 1];
      const mid = (s + e) / 2;
      const count = spans.filter(([p, q]) => p <= mid && q >= mid).length;
      if (!count) continue;
      const at = (t: number) => ({ x: base.x + dir.x * t, y: base.y + dir.y * t });
      pieces.push({ a: at(s), b: at(e), count });
    }
  }
  return pieces;
}
