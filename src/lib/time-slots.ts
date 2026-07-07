import { addDays, addMinutes, isBefore, startOfDay, format } from "date-fns";
import type {
  BookedSlot,
  DoctorScheduleOverride,
  DoctorWorkingHours,
} from "@/types";

export interface DayWindow {
  start: Date;
  end: Date;
}

function timeStringToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function combineDateAndMinutes(date: Date, minutes: number): Date {
  return addMinutes(startOfDay(date), minutes);
}

export function formatSlotDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function formatSlotTime(date: Date): string {
  return format(date, "HH:mm");
}

/**
 * Effective working window for a doctor on a given date.
 * A date-specific override always wins over the weekly template — it can
 * close a normally-open day, open a normally-closed one, or set custom hours.
 */
export function getEffectiveDayWindow(
  date: Date,
  workingHours: DoctorWorkingHours[],
  overrides: DoctorScheduleOverride[],
): DayWindow | null {
  const dateKey = formatSlotDate(date);
  const override = overrides.find((o) => o.date === dateKey);

  if (override) {
    if (!override.is_available) return null;
    const startMinutes = override.start_time
      ? timeStringToMinutes(override.start_time)
      : 0;
    const endMinutes = override.end_time
      ? timeStringToMinutes(override.end_time)
      : 24 * 60;
    if (endMinutes <= startMinutes) return null;
    return {
      start: combineDateAndMinutes(date, startMinutes),
      end: combineDateAndMinutes(date, endMinutes),
    };
  }

  const template = workingHours.find((w) => w.day_of_week === date.getDay());
  if (!template) return null;

  return {
    start: combineDateAndMinutes(date, timeStringToMinutes(template.start_time)),
    end: combineDateAndMinutes(date, timeStringToMinutes(template.end_time)),
  };
}

function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/** Generates bookable slot start times for a single day, excluding past
 * times and anything overlapping an already-booked appointment. */
export function generateSlotsForDay(
  date: Date,
  durationMinutes: number,
  workingHours: DoctorWorkingHours[],
  overrides: DoctorScheduleOverride[],
  bookedSlots: BookedSlot[],
): Date[] {
  const window = getEffectiveDayWindow(date, workingHours, overrides);
  if (!window) return [];

  const now = new Date();
  const slots: Date[] = [];
  let cursor = window.start;

  while (addMinutes(cursor, durationMinutes) <= window.end) {
    const slotEnd = addMinutes(cursor, durationMinutes);

    const overlapsBooked = bookedSlots.some((booked) => {
      const bookedStart = new Date(booked.scheduled_at);
      const bookedEnd = addMinutes(bookedStart, booked.duration_minutes);
      return rangesOverlap(cursor, slotEnd, bookedStart, bookedEnd);
    });

    if (!isBefore(cursor, now) && !overlapsBooked) {
      slots.push(cursor);
    }

    cursor = addMinutes(cursor, durationMinutes);
  }

  return slots;
}

/** Generates a day → available-slots map for a range starting at `fromDate`. */
export function generateSlotsForRange(
  fromDate: Date,
  daysCount: number,
  durationMinutes: number,
  workingHours: DoctorWorkingHours[],
  overrides: DoctorScheduleOverride[],
  bookedSlots: BookedSlot[],
): Map<string, Date[]> {
  const result = new Map<string, Date[]>();
  const start = startOfDay(fromDate);

  for (let i = 0; i < daysCount; i++) {
    const date = addDays(start, i);
    result.set(
      formatSlotDate(date),
      generateSlotsForDay(date, durationMinutes, workingHours, overrides, bookedSlots),
    );
  }

  return result;
}
