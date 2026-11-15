import { describe, expect, it } from "vitest";
import type { OpeningHours } from "@/lib/db/schema";
import { getMalaysiaDayAndMinutes, isOpenAt } from "./opening-hours";

const myt = (dateTime: string) => new Date(`${dateTime}+08:00`);

const weekdays = (open: string, close: string): OpeningHours => ({
  "1": { open, close },
  "2": { open, close },
  "3": { open, close },
  "4": { open, close },
  "5": { open, close },
  "6": { open, close },
  "0": { open, close },
});

describe("getMalaysiaDayAndMinutes", () => {
  it("converts UTC to Malaysia time, including crossing midnight", () => {
    expect(getMalaysiaDayAndMinutes(new Date("2026-11-15T17:30:00Z"))).toEqual({
      day: 1,
      minutes: 90,
    });
  });
});

describe("isOpenAt", () => {
  const lunchDinner = weekdays("11:00", "22:00");

  it("returns false when hours are not listed", () => {
    expect(isOpenAt(null, myt("2026-11-16T12:00"))).toBe(false);
  });

  it("is open between opening and closing time", () => {
    expect(isOpenAt(lunchDinner, myt("2026-11-16T12:00"))).toBe(true);
  });

  it("opens exactly at the opening time", () => {
    expect(isOpenAt(lunchDinner, myt("2026-11-16T11:00"))).toBe(true);
    expect(isOpenAt(lunchDinner, myt("2026-11-16T10:59"))).toBe(false);
  });

  it("is closed exactly at the closing time", () => {
    expect(isOpenAt(lunchDinner, myt("2026-11-16T21:59"))).toBe(true);
    expect(isOpenAt(lunchDinner, myt("2026-11-16T22:00"))).toBe(false);
  });

  it("is closed on a closed day", () => {
    const closedMonday: OpeningHours = {
      ...lunchDinner,
      "1": { closed: true },
    };
    expect(isOpenAt(closedMonday, myt("2026-11-16T12:00"))).toBe(false);
  });

  it("is closed on a day that is missing from the data", () => {
    const noMonday: OpeningHours = { ...lunchDinner };
    delete noMonday["1"];
    expect(isOpenAt(noMonday, myt("2026-11-16T12:00"))).toBe(false);
  });

  describe("overnight hours (18:00 – 02:00)", () => {
    const lateNight = weekdays("18:00", "02:00");

    it("is open late in the evening", () => {
      expect(isOpenAt(lateNight, myt("2026-11-16T23:00"))).toBe(true);
    });

    it("is still open after midnight from yesterday's slot", () => {
      expect(isOpenAt(lateNight, myt("2026-11-17T01:30"))).toBe(true);
    });

    it("closes at the closing time after midnight", () => {
      expect(isOpenAt(lateNight, myt("2026-11-17T02:00"))).toBe(false);
    });

    it("is closed in the early hours if yesterday was a closed day", () => {
      const closedMonday: OpeningHours = {
        ...lateNight,
        "1": { closed: true },
      };
      expect(isOpenAt(closedMonday, myt("2026-11-17T01:30"))).toBe(false);
    });
  });

  it("treats 00:00 – 23:59 as open all day", () => {
    const mamak24 = weekdays("00:00", "23:59");
    expect(isOpenAt(mamak24, myt("2026-11-16T00:00"))).toBe(true);
    expect(isOpenAt(mamak24, myt("2026-11-16T23:59"))).toBe(true);
  });

  it("uses Malaysia time, not the server's time zone", () => {
    expect(isOpenAt(lunchDinner, new Date("2026-11-16T04:00:00Z"))).toBe(true);
    expect(isOpenAt(lunchDinner, new Date("2026-11-16T15:00:00Z"))).toBe(false);
  });
});
