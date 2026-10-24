import { describe, expect, it } from "vitest";
import { book, canBook, seatsLeft, type Ride } from "./rides";

const ride = (over: Partial<Ride> = {}): Ride => ({
  id: "t",
  driver: "Test",
  start: { x: 0, y: 0 },
  end: { x: 5, y: 0 },
  departAt: "2026-10-25T08:30",
  seats: 3,
  booked: 0,
  ...over,
});

describe("ride booking", () => {
  it("booking a seat reduces the seats left by one", () => {
    expect(seatsLeft(book(ride({ seats: 3, booked: 1 })))).toBe(1);
  });

  it("a full ride cannot be booked", () => {
    const full = ride({ seats: 2, booked: 2 });
    expect(canBook(full)).toBe(false);
    expect(book(full).booked).toBe(2);
  });

  it("seats left never goes below zero", () => {
    expect(seatsLeft(ride({ seats: 1, booked: 3 }))).toBe(0);
  });
});
