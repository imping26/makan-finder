import type { OpeningHours } from "@/lib/db/schema";

type Day = keyof OpeningHours;

const MALAYSIA_UTC_OFFSET_MS = 8 * 60 * 60 * 1000;
const MINUTES_PER_DAY = 24 * 60;

export function getMalaysiaDayAndMinutes(date: Date) {
  const shifted = new Date(date.getTime() + MALAYSIA_UTC_OFFSET_MS);
  return {
    day: shifted.getUTCDay(),
    minutes: shifted.getUTCHours() * 60 + shifted.getUTCMinutes(),
  };
}

function toMinutes(time: string) {
  if (time === "23:59") return MINUTES_PER_DAY;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getSlot(hours: OpeningHours, day: number) {
  const slot = hours[String(day) as Day];
  if (!slot || "closed" in slot) return null;
  return { open: toMinutes(slot.open), close: toMinutes(slot.close) };
}

export function isOpenAt(hours: OpeningHours | null, date: Date) {
  if (!hours) return false;

  const { day, minutes } = getMalaysiaDayAndMinutes(date);

  const today = getSlot(hours, day);
  if (today) {
    const overnight = today.close <= today.open;
    if (
      overnight
        ? minutes >= today.open
        : minutes >= today.open && minutes < today.close
    ) {
      return true;
    }
  }

  const yesterday = getSlot(hours, (day + 6) % 7);
  if (
    yesterday &&
    yesterday.close <= yesterday.open &&
    minutes < yesterday.close
  ) {
    return true;
  }

  return false;
}
