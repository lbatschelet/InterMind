import { createLogger } from "../../utils/logger";
import {
  DaySegment,
  Slot,
  SlotManagerConfig,
  SlotStatus,
  TimeRange,
} from "../../types/slots";

/**
 * Default configuration for {@link SlotManager}. All times are in local device
 * time. Adjust the ranges here if you want to move a segment boundary without
 * touching any runtime code.
 */
export const DEFAULT_CONFIG: SlotManagerConfig = {
  MORNING_RANGE: { name: "morning", startHour: 7, startMinute: 30, endHour: 11, endMinute: 0 },
  NOON_RANGE:    { name: "noon",    startHour: 11, startMinute: 0, endHour: 17, endMinute: 0 },
  EVENING_RANGE: { name: "evening", startHour: 17, startMinute: 0, endHour: 22, endMinute: 0 },
  SLOT_LENGTH_MINUTES:       60,
  TIME_GRANULARITY_MINUTES:  5,
  MIN_GAP_COMPLETED_MINUTES: 180,
  MIN_GAP_EXPIRED_MINUTES:   120,
};

const log = createLogger("SlotManager");

/**
 * Pure utility class responsible for calculating **when** the *next* survey slot
 * should start and end. The class is **stateless** – all decisions are derived
 * from the method arguments and the injected {@link SlotManagerConfig}.
 *
 * **What it does not do**: scheduling push notifications. That is handled
 * by your `NotificationScheduler` implementation.
 *
 * ### Key design choices (vs. the legacy version)
 * * **Four segments** – a new *NIGHT* segment (22:00-07:29) prevents the
 *   unwanted "EVENING ➜ MORNING (+1 day)" shift.
 * * **Iterative search** – a `while`‑loop with a hard max depth replaces the
 *   recursive fallback, eliminating any chance of stack overflow / endless
 *   recursion.
 * * **Deterministic random optional** – for reproducible slot times you can
 *   swap the built‑in RNG with a seedable one (see `getRandomTimeInRange`).
 */
export class SlotManager {
  /**
   * Creates a new SlotManager instance.
   * 
   * @param config - Slot generation parameters. If omitted
   *                 {@link DEFAULT_CONFIG} is used.
   */
  constructor(private readonly config: SlotManagerConfig = DEFAULT_CONFIG) {}

  /**
   * Calculates the *next* usable slot.
   *
   * @param now - Current timestamp (normally `new Date()`).
   * @param lastEnd - `Date` when the previous slot ended *or* `null` if there
   *               has never been a slot before.
   * @param lastStatus - Outcome of the previous slot (`COMPLETED`, `EXPIRED`, etc.)
   *                   or `null` on first invocation.
   * @returns A {@link Slot} object containing the start and end time
   *         of the upcoming slot. The length equals `config.SLOT_LENGTH_MINUTES`.
   */
  public nextSlot(now: Date, lastEnd: Date | null, lastStatus: SlotStatus | null): Slot {
    log.info("nextSlot() called", {
      now: now.toISOString(),
      lastEnd: lastEnd?.toISOString(),
      lastStatus,
    });

    // ────────────────────────────────────────────────────────────────────────────
    // 1.  Determine the previous segment & reference date
    // ────────────────────────────────────────────────────────────────────────────
    let prevSegment: DaySegment;
    let referenceDate = new Date(now);

    if (!lastEnd) {
      // First ever call – treat it as if we ended an EVENING slot yesterday so
      // the algorithm starts at MORNING today.
      prevSegment = DaySegment.EVENING;
      referenceDate.setDate(referenceDate.getDate() - 1);
    } else {
      prevSegment = this.getSegmentForTime(lastEnd);
      referenceDate = new Date(lastEnd);
    }

    // ────────────────────────────────────────────────────────────────────────────
    // 2.  Build a *global* earliest date respecting:
    //     • 60 min anti-spam buffer from *now*
    //     • min. gap after the end of the previous slot
    // ────────────────────────────────────────────────────────────────────────────
    const gapMinutes =
      lastStatus === SlotStatus.EXPIRED
        ? this.config.MIN_GAP_EXPIRED_MINUTES
        : this.config.MIN_GAP_COMPLETED_MINUTES;

    const earliestGlobal = new Date(now.getTime() + 60 * 60 * 1000); // +60 min
    if (lastEnd) {
      const minAfterLast = lastEnd.getTime() + gapMinutes * 60 * 1000;
      earliestGlobal.setTime(Math.max(earliestGlobal.getTime(), minAfterLast));
    }

    // ────────────────────────────────────────────────────────────────────────────
    // 3.  Iterate over segments until a valid time window is found
    // ────────────────────────────────────────────────────────────────────────────
    let segment = this.getNextSegment(prevSegment);
    let segmentDate = new Date(referenceDate);
    const MAX_ITER = 10; // ~ 3 days => hard stop safety

    for (let iter = 0; iter < MAX_ITER; iter++) {
      // NIGHT is never scheduled, immediately skip to MORNING
      if (segment === DaySegment.NIGHT) {
        segment = DaySegment.MORNING;
        segmentDate.setDate(segmentDate.getDate() + 1);
      }

      const startOfSegment = this.getSegmentStartTime(segment, segmentDate);
      const endOfSegment   = this.getSegmentEndTime(segment, segmentDate);

      // Earliest candidate must satisfy all buffers *and* land inside segment
      let earliest = new Date(Math.max(earliestGlobal.getTime(), startOfSegment.getTime()));
      earliest = this.roundUpToGranularity(earliest);

      const latestStart = new Date(endOfSegment.getTime() - this.config.SLOT_LENGTH_MINUTES * 60 * 1000);

      if (earliest <= latestStart) {
        const start = this.getRandomTimeInRange(earliest, latestStart);
        const end   = new Date(start.getTime() + this.config.SLOT_LENGTH_MINUTES * 60 * 1000);

        log.info("slot chosen", { segment, start: start.toISOString(), end: end.toISOString() });
        return { start, end };
      }

      // No room in this segment – move to the next
      segment = this.getNextSegment(segment);
      if (segment === DaySegment.MORNING) segmentDate.setDate(segmentDate.getDate() + 1);
    }

    // Fallback (should never trigger)
    log.error("Unable to find a slot within safety bounds; returning +2 h fallback");
    const start = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const end   = new Date(start.getTime() + this.config.SLOT_LENGTH_MINUTES * 60 * 1000);
    return { start, end };
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Helper methods – all internal, purely functional.
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Maps a timestamp to one of the four DaySegments.
   * 
   * @param time - The Date object to determine which segment it belongs to
   * @returns The day segment (MORNING, NOON, EVENING, or NIGHT)
   */
  public getSegmentForTime(time: Date): DaySegment {
    const min = time.getHours() * 60 + time.getMinutes();
    const toMin = (r: TimeRange) => r.startHour * 60 + r.startMinute;

    const mStart = toMin(this.config.MORNING_RANGE);
    const mEnd   = this.config.MORNING_RANGE.endHour * 60 + this.config.MORNING_RANGE.endMinute;
    const nEnd   = this.config.NOON_RANGE.endHour * 60 + this.config.NOON_RANGE.endMinute;
    const eEnd   = this.config.EVENING_RANGE.endHour * 60 + this.config.EVENING_RANGE.endMinute;

    if (min >= mStart && min < mEnd) return DaySegment.MORNING;
    if (min >= mEnd   && min < nEnd) return DaySegment.NOON;
    if (min >= nEnd   && min < eEnd) return DaySegment.EVENING;
    return DaySegment.NIGHT; // 22:00‑07:29
  }

  /** 
   * Returns the next segment in cyclical order.
   * 
   * @param s - The current day segment
   * @returns The next day segment in the cycle
   * @private
   */
  private getNextSegment(s: DaySegment): DaySegment {
    switch (s) {
      case DaySegment.NIGHT:   return DaySegment.MORNING;
      case DaySegment.MORNING: return DaySegment.NOON;
      case DaySegment.NOON:    return DaySegment.EVENING;
      case DaySegment.EVENING: return DaySegment.NIGHT;
      default:                 return DaySegment.MORNING;
    }
  }

  /**
   * Gets the start time for a given segment on a specific date.
   * 
   * @param seg - The day segment
   * @param date - The reference date
   * @returns Date object set to the beginning of the segment
   * @private
   */
  private getSegmentStartTime(seg: DaySegment, date: Date): Date {
    const d = new Date(date);
    const r = this.rangeForSegment(seg);
    d.setHours(r.startHour, r.startMinute, 0, 0);
    return d;
  }

  /**
   * Gets the end time for a given segment on a specific date.
   * 
   * @param seg - The day segment
   * @param date - The reference date
   * @returns Date object set to the end of the segment
   * @private
   */
  private getSegmentEndTime(seg: DaySegment, date: Date): Date {
    const d = new Date(date);
    const r = this.rangeForSegment(seg);
    d.setHours(r.endHour, r.endMinute, 0, 0);
    return d;
  }

  /**
   * Gets the TimeRange configuration for a given day segment.
   * 
   * @param seg - The day segment
   * @returns TimeRange configuration for the segment
   * @private
   */
  private rangeForSegment(seg: DaySegment): TimeRange {
    switch (seg) {
      case DaySegment.MORNING: return this.config.MORNING_RANGE;
      case DaySegment.NOON:    return this.config.NOON_RANGE;
      case DaySegment.EVENING: return this.config.EVENING_RANGE;
      default:                return this.config.MORNING_RANGE; // placeholder for NIGHT
    }
  }

  /** 
   * Rounds time upwards to the closest TIME_GRANULARITY_MINUTES boundary.
   * 
   * @param t - Date to round up
   * @returns New Date rounded up to the granularity boundary
   * @private
   */
  private roundUpToGranularity(t: Date): Date {
    const gMs = this.config.TIME_GRANULARITY_MINUTES * 60 * 1000;
    const rem = t.getTime() % gMs;
    return rem === 0 ? t : new Date(t.getTime() + (gMs - rem));
  }

  /**
   * Returns a random time on the configured granularity grid between two
   * bounds (inclusive). For reproducible schedules replace `Math.random()`
   * with a seeded RNG.
   * 
   * @param earliest - The earliest possible time
   * @param latest - The latest possible time
   * @returns A random Date between earliest and latest
   * @private
   */
  private getRandomTimeInRange(earliest: Date, latest: Date): Date {
    const gMs   = this.config.TIME_GRANULARITY_MINUTES * 60 * 1000;
    const steps = Math.floor((latest.getTime() - earliest.getTime()) / gMs);
    const idx   = Math.floor(Math.random() * (steps + 1));
    return new Date(earliest.getTime() + idx * gMs);
  }
}
