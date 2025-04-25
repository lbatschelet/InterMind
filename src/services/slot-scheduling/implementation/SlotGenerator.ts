/* SlotGenerator.ts – final                              (≈ 160 LoC) */

import { DaySegment }           from "../../../types/slots";
import { ISlot, SlotStatus }    from "../interfaces/ISlot";
import { ISlotGenerator }       from "../interfaces/ISlotGenerator";
import { ITimeConfig }          from "../interfaces/ITimeConfig";
import { createLogger }         from "../../../utils/logger";

const log = createLogger("SlotGenerator");
const TICK_MS = 5 * 60_000;   // 5-minute grid

export class SlotGenerator implements ISlotGenerator {
  generateSchedule(firstSurveyEnd: Date, days: number, cfg: ITimeConfig): ISlot[] {
    log.info(
      `Generating schedule for ${days} days starting from ${firstSurveyEnd.toISOString()}`
    );

    /* crypto-safe random int in [0,n) */
    const rand = (n: number) =>
      typeof crypto !== "undefined" && crypto.getRandomValues
        ? crypto.getRandomValues(new Uint32Array(1))[0] % n
        : Math.floor(Math.random() * n);

    const roundUp5 = (d: Date) =>
      d.setMinutes(Math.ceil(d.getMinutes() / 5) * 5, 0, 0);

    const ORDER: readonly DaySegment[] = [
      DaySegment.MORNING,
      DaySegment.NOON,
      DaySegment.EVENING,
    ];

    /* first frame we’re in */
    const currentSeg = toSegment(new Date(), cfg);

    /* horizon = same frame N days later */
    const horizonDate = new Date();
    horizonDate.setDate(horizonDate.getDate() + days);
    horizonDate.setHours(0, 0, 0, 0);
    const horizonKey = key(horizonDate, currentSeg);

    const slots: ISlot[] = [];

    /* ----------------------------------------------------------------
     * lastEnd = end of previous slot
     *  – For the first call we IGNORE any “future” timestamp that was
     *    passed in (now + slotLen) and pin it to *now*.
     * ---------------------------------------------------------------- */
    const nowMs  = Date.now();
    let lastEnd  = new Date(Math.min(firstSurveyEnd.getTime(), nowMs));

    /* iterate day-by-day                                            */
    let iter = new Date(); iter.setHours(0, 0, 0, 0); // today 00:00

    while (true) {
      for (const seg of ORDER) {
        if (key(iter, seg) > horizonKey) {
          log.info(`Generated ${slots.length} slots`);
          return slots;
        }

        const range       = rangeForSegment(seg, cfg);
        const frameStart  = atTime(iter, range.startHour, range.startMinute);
        const frameEnd    = atTime(iter, range.endHour,   range.endMinute);
        const latestStart = new Date(frameEnd.getTime() - cfg.SLOT_LENGTH_MINUTES * 60_000);

        if (latestStart < frameStart) continue;           // frame shorter than slot
        if (latestStart.getTime() < nowMs) continue;      // frame already over

        const earliest = new Date(
          Math.max(
            frameStart.getTime(),
            lastEnd.getTime() + cfg.MIN_GAP_MINUTES * 60_000,
            nowMs + cfg.MIN_GAP_MINUTES * 60_000           // always ≥ 3 h from *now*
          )
        );
        roundUp5(earliest);

        if (earliest > latestStart) {
          log.debug(
            `No room in ${seg} ${iter.toDateString()}: earliest ${t(earliest)} > latest ${t(latestStart)}`
          );
          continue;
        }

        const steps = Math.floor((latestStart.getTime() - earliest.getTime()) / TICK_MS);
        const start = new Date(earliest.getTime() + rand(steps + 1) * TICK_MS);
        const end   = new Date(start.getTime() + cfg.SLOT_LENGTH_MINUTES * 60_000);

        slots.push({
          id: `slot_${key(iter, seg)}_${slots.length}`,
          start, end, daySegment: seg,
          status: SlotStatus.PENDING,
        });
        lastEnd = end;

        log.info(`Generated slot ${seg} ${t(start)}–${t(end)}`);
      }
      iter.setDate(iter.getDate() + 1);                   // next calendar day
    }
  }
}

/* ---------- helpers (typed, internal) ----------------------------- */

function rangeForSegment(seg: DaySegment, c: ITimeConfig) {
  switch (seg) {
    case DaySegment.MORNING: return c.MORNING_RANGE;
    case DaySegment.NOON:    return c.NOON_RANGE;
    case DaySegment.EVENING: return c.EVENING_RANGE;
    default: {
      const never: never = seg; throw new Error(`Unknown segment ${never}`);
    }
  }
}
const atTime = (d: Date, h: number, m: number) => { const r = new Date(d); r.setHours(h, m, 0, 0); return r; };
const key    = (d: Date, seg: DaySegment) => `${d.toISOString().slice(0,10)}_${seg}`;
const t      = (d: Date) => d.toLocaleTimeString();

function toSegment(d: Date, cfg: ITimeConfig): DaySegment {
  const mm = d.getHours() * 60 + d.getMinutes();
  const inR = (r: any) => mm >= r.startHour * 60 + r.startMinute && mm < r.endHour * 60 + r.endMinute;
  if (inR(cfg.MORNING_RANGE)) return DaySegment.MORNING;
  if (inR(cfg.NOON_RANGE))    return DaySegment.NOON;
  return DaySegment.EVENING;
}
