import { createLogger } from "../../utils/logger";
import { NotificationScheduler } from "./NotificationScheduler";
import { SlotManager } from "./SlotManager";
import { SlotStateStore } from "./SlotStateStore";
import {
  Slot,
  SlotMeta,
  SlotStatus,
  SurveyEvent,
  eventToStatus,
} from "../../types/slots";

/* -------------------------------------------------------------------------
 * SlotCoordinator – orchestrates three concerns:
 *   1. Persist current slot & status  (SlotStateStore)
 *   2. Calculate next slot            (SlotManager)
 *   3. Schedule push notifications    (NotificationScheduler)
 *
 * Public API is **identical** to the legacy coordinator – you can replace the
 * file and rebuild without touching any callers.
 * -------------------------------------------------------------------------*/

const log = createLogger("SlotCoordinator");

/** Number of years the permanent "initial slot" should stay open. */
const INITIAL_SLOT_YEARS = 100;

export class SlotCoordinator {
  // NOTE: properties kept `public` only where callers previously accessed them.
  constructor(
    public readonly slotManager: SlotManager,
    private readonly slotStore: SlotStateStore,
    public readonly notificationScheduler: NotificationScheduler,
  ) {}

  /* ---------------------------------------------------------------------
   * INITIALISATION
   * -------------------------------------------------------------------*/
  private initInProgress = false;
  private initDone = false;

  /**
   * Ensure there is **some** slot persisted and its notification scheduled.
   * Called once during app bootstrap but is idempotent and re‑entrant safe.
   */
  async initialize(): Promise<void> {
    if (this.initDone || this.initInProgress) {
      log.debug("initialize() skipped – already done or running");
      return;
    }

    this.initInProgress = true;
    const now = new Date();

    try {
      let slot = await this.getCurrentSlot();
      let meta = await this.slotStore.readLastMeta();

      // ── 1) create permanent INITIAL slot if none exists ────────────
      if (!slot) {
        slot = this.makePermanentSlot(now);
        await this.slotStore.saveSlot(slot, SlotStatus.INITIAL);
        meta = { start: slot.start, end: slot.end, status: SlotStatus.INITIAL } as SlotMeta;
        log.info("Permanent INITIAL slot created");
      }

      // ── 2) bump legacy 1‑year initial slot to 100‑year one ───────────
      if (meta?.status === SlotStatus.INITIAL && this.yearsBetween(slot.end, now) < 90) {
        const upgraded = this.makePermanentSlot(slot.start);
        await this.slotStore.saveSlot(upgraded, SlotStatus.INITIAL);
        slot = upgraded;
        log.info("Upgraded legacy INITIAL slot to 100‑year duration");
      }

      // ── 3) expired normal slot → compute next one ───────────────────
      if (meta?.status !== SlotStatus.INITIAL && now > slot.end) {
        slot = await this.createNextSlot(now, meta);
        log.info("Expired slot replaced", { start: slot.start, end: slot.end });
      }

      // ── 4) ensure notification exists and matches slot.start ────────
      await this.ensureNotification(slot);
    } catch (error) {
      log.error("SlotCoordinator.initialize() failed", error);
    } finally {
      this.initDone = true;
      this.initInProgress = false;
    }
  }

  /* ---------------------------------------------------------------------
   * SURVEY EVENTS
   * -------------------------------------------------------------------*/

  /**
   * Main entry when the survey frontend reports a user action.
   */
  async onSurveyEvent(evt: SurveyEvent): Promise<Slot> {
    const now = new Date();
    const status = eventToStatus(evt);

    // FIRST_SURVEY_COMPLETED ends the never‑ending INITIAL slot
    if (evt === SurveyEvent.FIRST_SURVEY_COMPLETED) {
      const next = await this.slotManager.nextSlot(now, now, SlotStatus.FIRST_COMPLETED);
      await this.slotStore.saveSlot(next, SlotStatus.FIRST_COMPLETED);
      await this.ensureNotification(next);
      log.info("Switched from INITIAL to scheduled slots", { start: next.start, end: next.end });
      return next;
    }

    // All other events --------------------------------------------------
    const lastMeta = await this.slotStore.readLastMeta();
    const current = await this.getCurrentSlot();

    // Keep future slot, only update status & notification
    if (current && now < current.start) {
      if (lastMeta?.status !== status) await this.slotStore.saveSlot(current, status);
      await this.ensureNotification(current);
      return current;
    }

    // Otherwise compute a new slot
    const baseEnd = lastMeta?.end ?? now;
    const next = await this.slotManager.nextSlot(now, baseEnd, lastMeta?.status ?? status);
    await this.slotStore.saveSlot(next, status);
    await this.ensureNotification(next);
    return next;
  }

  /* ---------------------------------------------------------------------
   *  HELPERS
   * -------------------------------------------------------------------*/

  private makePermanentSlot(anchor: Date): Slot {
    const start = new Date(anchor);
    const end = new Date(anchor);
    end.setFullYear(end.getFullYear() + INITIAL_SLOT_YEARS);
    return { start, end };
  }

  private yearsBetween(a: Date, b: Date): number {
    return Math.abs(a.getFullYear() - b.getFullYear());
  }

  /**
   * Schedules exactly **one** notification that matches `slot.start`.
   * If a notification exists but differs by >2 min it will be replaced.
   */
  private async ensureNotification(slot: Slot): Promise<void> {
    const nextNoti = await this.notificationScheduler.getNextScheduledNotificationTime();
    const diffMs = nextNoti ? Math.abs(nextNoti.getTime() - slot.start.getTime()) : Infinity;

    if (diffMs > 2 * 60 * 1000) {
      await this.notificationScheduler.cancelAll();
      await this.notificationScheduler.schedule(slot);
      log.debug("Notification (re)scheduled", { at: slot.start });
    }
  }

  private async createNextSlot(now: Date, lastMeta: SlotMeta | null): Promise<Slot> {
    const next = await this.slotManager.nextSlot(now, lastMeta?.end ?? now, lastMeta?.status ?? SlotStatus.EXPIRED);
    await this.slotStore.saveSlot(next, SlotStatus.EXPIRED);
    await this.ensureNotification(next);
    return next;
  }

  /* ---------------------------------------------------------------------
   *  PUBLIC PASS‑THROUGHS (unchanged)
   * -------------------------------------------------------------------*/
  async isSurveyAvailable(): Promise<boolean> {
    const meta = await this.slotStore.readLastMeta();
    if (meta?.status === SlotStatus.INITIAL) return true;
    return this.slotStore.isInActiveSlot();
  }

  async getCurrentSlot(): Promise<Slot | null> {
    return this.slotStore.readCurrentSlot();
  }

  async readLastMeta(): Promise<SlotMeta | null> {
    return this.slotStore.readLastMeta();
  }

  async cancelAllNotifications(): Promise<void> {
    await this.notificationScheduler.cancelAll();
  }

  /** Allows a full reset during logout / debug. */
  resetInitializationState(): void {
    this.initDone = false;
    this.initInProgress = false;
  }
}
