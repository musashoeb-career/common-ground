import { describe, it, expect } from "vitest";
import { computeOverlaps } from "./overlap";

describe("computeOverlaps", () => {
  it("(0,0)-(3,0) and (0,0)-(5,0): 0..3 doubled, 3..5 single", () => {
    const p = computeOverlaps([
      { a: { x: 0, y: 0 }, b: { x: 3, y: 0 } },
      { a: { x: 0, y: 0 }, b: { x: 5, y: 0 } },
    ]);
    expect(p).toContainEqual({ a: { x: 0, y: 0 }, b: { x: 3, y: 0 }, count: 2 });
    expect(p).toContainEqual({ a: { x: 3, y: 0 }, b: { x: 5, y: 0 }, count: 1 });
  });
  it("crossing lines do not count as overlap", () => {
    const p = computeOverlaps([
      { a: { x: 0, y: 0 }, b: { x: 4, y: 4 } },
      { a: { x: 0, y: 4 }, b: { x: 4, y: 0 } },
    ]);
    expect(p.every((x) => x.count === 1)).toBe(true);
  });
  it("reversed direction still overlaps", () => {
    const p = computeOverlaps([
      { a: { x: 0, y: 0 }, b: { x: 2, y: 2 } },
      { a: { x: 3, y: 3 }, b: { x: 1, y: 1 } },
    ]);
    expect(p).toContainEqual({ a: { x: 1, y: 1 }, b: { x: 2, y: 2 }, count: 2 });
  });
});
