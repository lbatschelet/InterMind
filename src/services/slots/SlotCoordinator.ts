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
import { registerBackgroundTask } from "./BackgroundTaskAdapter";
import { EventEmitter } from "events";

/**
 * SlotCoordinator - Main orchestrator for the slot-based survey system
 * 
 * Orchestrates three main concerns:
 * 1. Persist current slot & status (SlotStateStore)
 * 2. Calculate next slot (SlotManager)
 * 3. Schedule push notifications (NotificationScheduler)
 * 4. Emit events when slots change (EventEmitter)
 *
 * The public API is identical to the legacy coordinator - you can replace the
 * file and rebuild without touching any callers.
 * 
 * IMPORTANT SPECIAL CASE:
 * The "INITIAL" slot has a 100-year duration by design, to always be available.
 * When we create the next slot after an INITIAL slot, we have to use the 
 * current time as reference, NOT the end time of the INITIAL slot, which 
 * would be 100 years in the future. This special case is handled in:
 * - createNextSlot()
 * - onSurveyEvent()
 * - initialize()
 */

const log = createLogger("SlotCoordinator");

/** Number of years the permanent "initial slot" should stay open. */
const INITIAL_SLOT_YEARS = 100;

/**
 * Events emitted by the slot coordinator.
 */
export enum SlotCoordinatorEvent {
  /** Emitted when the current slot changes */
  SLOT_CHANGED = 'slotChanged',
  /** Emitted when the slot status changes */
  STATUS_CHANGED = 'statusChanged',
  /** Emitted when a slot expires */
  SLOT_EXPIRED = 'slotExpired',
  /** Emitted when an initial slot is created */
  INITIAL_SLOT_CREATED = 'initialSlotCreated'
}

/**
 * Main coordinator for the slot-based survey system.
 * 
 * This class orchestrates all aspects of slot management:
 * - Maintains slot state persistence
 * - Handles slot timing calculations
 * - Manages notification scheduling
 * - Emits events for slot lifecycle changes
 */
export class SlotCoordinator {
  /** EventEmitter for slot change events */
  private readonly eventEmitter = new EventEmitter();
  
  /**
   * Creates a new SlotCoordinator.
   * 
   * @param slotManager - Service to calculate slot timing
   * @param slotStore - Service to persist slot state
   * @param notificationScheduler - Service to schedule notifications
   */
  constructor(
    public readonly slotManager: SlotManager,
    private readonly slotStore: SlotStateStore,
    public readonly notificationScheduler: NotificationScheduler,
  ) {}
  
  /**
   * Registers an event handler for a specific event type.
   * 
   * @param event - The event type to listen for
   * @param listener - The handler function to call when the event occurs
   * @returns This instance for chaining
   */
  on(event: SlotCoordinatorEvent, listener: (...args: any[]) => void): this {
    this.eventEmitter.on(event, listener);
    return this;
  }
  
  /**
   * Removes an event handler.
   * 
   * @param event - The event type 
   * @param listener - The handler to remove
   * @returns This instance for chaining
   */
  off(event: SlotCoordinatorEvent, listener: (...args: any[]) => void): this {
    this.eventEmitter.off(event, listener);
    return this;
  }
  
  /**
   * Registers a one-time event handler.
   * 
   * @param event - The event type
   * @param listener - The handler to call once
   * @returns This instance for chaining
   */
  once(event: SlotCoordinatorEvent, listener: (...args: any[]) => void): this {
    this.eventEmitter.once(event, listener);
    return this;
  }

  /**
   * Directly emits an event.
   * Primarily used by the BackgroundSlotManager.
   * 
   * @param event - The event to emit
   * @param args - Arguments for the event handler
   */
  public emitEvent(event: SlotCoordinatorEvent, ...args: any[]): void {
    this.eventEmitter.emit(event, ...args);
  }

  /* ---------------------------------------------------------------------
   * INITIALISATION
   * -------------------------------------------------------------------*/
  private initInProgress = false;
  private initDone = false;

  /**
   * Ensures there is a valid slot persisted and its notification scheduled.
   * Called once during app bootstrap but is idempotent and re-entrant safe.
   * 
   * @returns Promise that resolves when initialization is complete
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
      let slotChanged = false;
      let oldSlot = slot;
      let oldStatus = meta?.status;

      // Case 1: No slot exists at all - create permanent INITIAL slot
      if (!slot) {
        slot = this.makePermanentSlot(now);
        await this.slotStore.saveSlot(slot, SlotStatus.INITIAL);
        meta = { start: slot.start, end: slot.end, status: SlotStatus.INITIAL } as SlotMeta;
        log.info("Permanent INITIAL slot created");
        slotChanged = true;
        
        // Event for new INITIAL slots
        this.eventEmitter.emit(SlotCoordinatorEvent.INITIAL_SLOT_CREATED, slot);
      } 
      // Case 2: An INITIAL slot exists - ensure it has 100-year duration
      else if (meta?.status === SlotStatus.INITIAL) {
        // Check if it needs extending (legacy shorter slots)
        if (this.yearsBetween(slot.end, now) < 90) {
          const upgraded = this.makePermanentSlot(slot.start);
          await this.slotStore.saveSlot(upgraded, SlotStatus.INITIAL);
          oldSlot = slot;
          slot = upgraded;
          log.info("Upgraded legacy INITIAL slot to 100‑year duration");
          slotChanged = true;
        } else {
          log.debug("Preserving existing INITIAL slot");
        }
      }
      // Case 3: A regular slot that has expired - create a new one
      else if (now > slot.end) {
        oldSlot = slot;
        oldStatus = meta?.status;
        slot = await this.createNextSlot(now, meta);
        log.info("Expired slot replaced", { start: slot.start, end: slot.end });
        slotChanged = true;
        
        // Event for expired slot
        this.eventEmitter.emit(SlotCoordinatorEvent.SLOT_EXPIRED, oldSlot, slot);
      }
      // Case 4: A regular slot that is still valid - keep it
      else {
        log.debug("Using existing valid slot", { 
          start: slot.start, 
          end: slot.end, 
          status: meta?.status 
        });
      }

      // If the slot has changed, emit the event
      if (slotChanged) {
        this.eventEmitter.emit(
          SlotCoordinatorEvent.SLOT_CHANGED, 
          slot, 
          meta?.status, 
          oldSlot, 
          oldStatus
        );
        
        if (oldStatus !== meta?.status) {
          this.eventEmitter.emit(
            SlotCoordinatorEvent.STATUS_CHANGED,
            meta?.status,
            oldStatus
          );
        }
      }

      // Finally, ensure notification exists and matches slot.start
      await this.ensureNotification(slot);
      
      // Register the background task to check for slot expiry
      await registerBackgroundTask();
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
   * 
   * @param evt - The survey event that occurred
   * @returns Promise resolving to the next slot
   */
  async onSurveyEvent(evt: SurveyEvent): Promise<Slot> {
    const now = new Date();
    const status = eventToStatus(evt);
    const oldMeta = await this.slotStore.readLastMeta();
    const oldSlot = await this.getCurrentSlot();

    // FIRST_SURVEY_COMPLETED ends the never‑ending INITIAL slot
    if (evt === SurveyEvent.FIRST_SURVEY_COMPLETED) {
      const next = await this.slotManager.nextSlot(now, now, SlotStatus.FIRST_COMPLETED);
      await this.slotStore.saveSlot(next, SlotStatus.FIRST_COMPLETED);
      await this.ensureNotification(next);
      log.info("Switched from INITIAL to scheduled slots", { start: next.start, end: next.end });
      
      // Emit the events
      this.eventEmitter.emit(SlotCoordinatorEvent.SLOT_CHANGED, next, SlotStatus.FIRST_COMPLETED, oldSlot, oldMeta?.status);
      this.eventEmitter.emit(SlotCoordinatorEvent.STATUS_CHANGED, SlotStatus.FIRST_COMPLETED, oldMeta?.status);
      
      return next;
    }

    // All other events --------------------------------------------------
    const lastMeta = await this.slotStore.readLastMeta();
    const current = await this.getCurrentSlot();

    // Keep future slot, only update status & notification
    if (current && now < current.start) {
      if (lastMeta?.status !== status) {
        await this.slotStore.saveSlot(current, status);
        // Status changed, but slot remains the same
        this.eventEmitter.emit(SlotCoordinatorEvent.STATUS_CHANGED, status, lastMeta?.status);
      }
      await this.ensureNotification(current);
      return current;
    }

    // Otherwise compute a new slot
    // For INITIAL slots, use current time instead of the far-future end time
    let baseEnd = now;
    if (lastMeta?.status !== SlotStatus.INITIAL) {
      baseEnd = lastMeta?.end ?? now;
    } else {
      log.info("Creating next slot after INITIAL slot using current time instead of end time");
    }
    
    const next = await this.slotManager.nextSlot(now, baseEnd, lastMeta?.status ?? status);
    await this.slotStore.saveSlot(next, status);
    await this.ensureNotification(next);
    
    // New slot created, emit event
    this.eventEmitter.emit(SlotCoordinatorEvent.SLOT_CHANGED, next, status, current, lastMeta?.status);
    
    if (status !== lastMeta?.status) {
      this.eventEmitter.emit(SlotCoordinatorEvent.STATUS_CHANGED, status, lastMeta?.status);
    }
    
    // If the previous slot is expired
    if (current && now > current.end) {
      this.eventEmitter.emit(SlotCoordinatorEvent.SLOT_EXPIRED, current, next);
    }
    
    return next;
  }

  /* ---------------------------------------------------------------------
   *  HELPERS
   * -------------------------------------------------------------------*/

  /**
   * Creates a permanent (100-year) slot starting from the anchor date.
   * 
   * @param anchor - The start date for the permanent slot
   * @returns A slot with 100-year duration
   * @private
   */
  private makePermanentSlot(anchor: Date): Slot {
    const start = new Date(anchor);
    const end = new Date(anchor);
    end.setFullYear(end.getFullYear() + INITIAL_SLOT_YEARS);
    return { start, end };
  }

  /**
   * Calculates the absolute number of years between two dates.
   * 
   * @param a - First date
   * @param b - Second date
   * @returns Absolute number of years between dates
   * @private
   */
  private yearsBetween(a: Date, b: Date): number {
    return Math.abs(a.getFullYear() - b.getFullYear());
  }

  /**
   * Schedules exactly one notification that matches the slot start time.
   * If a notification exists but differs by >2 min it will be replaced.
   * 
   * @param slot - The slot to schedule notification for
   * @private
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

  /**
   * Creates the next slot after the current one has expired.
   * 
   * @param now - Current time
   * @param lastMeta - Metadata from the last slot
   * @returns Promise resolving to the new slot
   * @private
   */
  private async createNextSlot(now: Date, lastMeta: SlotMeta | null): Promise<Slot> {
    // Special handling for INITIAL slots with 100-year duration
    // Instead of using the far-future end time, use the current time as reference
    let baseTime = now;
    let status = lastMeta?.status ?? SlotStatus.EXPIRED;
    
    if (lastMeta?.status === SlotStatus.INITIAL) {
      log.info("Creating next slot after INITIAL slot using current time instead of end time");
      // Use current time for INITIAL slots, not the far-future end time
      baseTime = now;
      // Don't change INITIAL status unless specifically requested by a survey event
      status = SlotStatus.INITIAL;
    } else {
      // For normal slots, use the actual end time
      baseTime = lastMeta?.end ?? now;
      status = SlotStatus.EXPIRED;
    }
    
    const currentSlot = await this.getCurrentSlot();
    const next = await this.slotManager.nextSlot(now, baseTime, status);
    await this.slotStore.saveSlot(next, status);
    await this.ensureNotification(next);
    
    // Emit events for slot changes
    this.eventEmitter.emit(SlotCoordinatorEvent.SLOT_CHANGED, next, status, currentSlot, lastMeta?.status);
    
    if (status !== lastMeta?.status) {
      this.eventEmitter.emit(SlotCoordinatorEvent.STATUS_CHANGED, status, lastMeta?.status);
    }
    
    return next;
  }

  /* ---------------------------------------------------------------------
   *  PUBLIC METHODS
   * -------------------------------------------------------------------*/
  
  /**
   * Checks if a survey is currently available.
   * 
   * @returns Promise resolving to true if a survey is available
   */
  async isSurveyAvailable(): Promise<boolean> {
    const meta = await this.slotStore.readLastMeta();
    if (meta?.status === SlotStatus.INITIAL) return true;
    return this.slotStore.isInActiveSlot();
  }

  /**
   * Gets the current active slot.
   * 
   * @returns Promise resolving to the current slot or null if none exists
   */
  async getCurrentSlot(): Promise<Slot | null> {
    return this.slotStore.readCurrentSlot();
  }

  /**
   * Gets the metadata from the last slot.
   * 
   * @returns Promise resolving to the last slot's metadata or null
   */
  async readLastMeta(): Promise<SlotMeta | null> {
    return this.slotStore.readLastMeta();
  }

  /**
   * Cancels all scheduled notifications.
   */
  async cancelAllNotifications(): Promise<void> {
    await this.notificationScheduler.cancelAll();
  }

  /** 
   * Allows a full reset during logout or debugging.
   */
  resetInitializationState(): void {
    this.initDone = false;
    this.initInProgress = false;
  }

  /**
   * Sets the current slot to INITIAL status (permanent survey).
   * Creates a 100-year duration slot starting from now.
   * 
   * @returns Promise resolving to the created permanent slot
   */
  async setStatusToInitial(): Promise<Slot> {
    const now = new Date();
    const oldMeta = await this.slotStore.readLastMeta();
    const oldSlot = await this.getCurrentSlot();
    
    const permanentSlot = this.makePermanentSlot(now);
    await this.slotStore.saveSlot(permanentSlot, SlotStatus.INITIAL);
    await this.ensureNotification(permanentSlot);
    log.info("Status set to INITIAL with permanent slot", { 
      start: permanentSlot.start, 
      end: permanentSlot.end 
    });
    
    // Emit events
    this.eventEmitter.emit(SlotCoordinatorEvent.SLOT_CHANGED, permanentSlot, SlotStatus.INITIAL, oldSlot, oldMeta?.status);
    this.eventEmitter.emit(SlotCoordinatorEvent.STATUS_CHANGED, SlotStatus.INITIAL, oldMeta?.status);
    this.eventEmitter.emit(SlotCoordinatorEvent.INITIAL_SLOT_CREATED, permanentSlot);
    
    return permanentSlot;
  }

  /**
   * Central method that checks if the current slot needs to be updated.
   * This method can be called by both the foreground app and background processes
   * and should unify the logic for slot updates.
   * 
   * @returns Object with information about the current slot status and whether an update occurred
   */
  async checkAndUpdateSlot(): Promise<{
    updated: boolean;
    currentSlot: Slot | null;
    lastStatus: SlotStatus | undefined;
    expired: boolean;
    reason: string;
  }> {
    const now = new Date();
    const currentSlot = await this.getCurrentSlot();
    const lastMeta = await this.readLastMeta();
    const lastStatus = lastMeta?.status;
    let updated = false;
    let expired = false;
    let reason = "no_update_needed";
    
    // If no slot exists, create a new INITIAL slot
    if (!currentSlot) {
      const slot = await this.setStatusToInitial();
      log.info("Created new INITIAL slot as none existed");
      return { 
        updated: true, 
        currentSlot: slot, 
        lastStatus: undefined, 
        expired: false,
        reason: "created_initial" 
      };
    }
    
    // If we're in INITIAL status, do nothing
    if (lastStatus === SlotStatus.INITIAL) {
      return { 
        updated: false, 
        currentSlot, 
        lastStatus, 
        expired: false,
        reason: "initial_status" 
      };
    }
    
    // If the survey has already been completed, do nothing
    if (lastStatus === SlotStatus.COMPLETED || lastStatus === SlotStatus.FIRST_COMPLETED) {
      return { 
        updated: false, 
        currentSlot, 
        lastStatus, 
        expired: false,
        reason: "already_completed" 
      };
    }
    
    // If the current slot has expired, create a new one
    if (currentSlot && now > currentSlot.end) {
      // Emit event BEFORE changing the slot
      this.emitEvent(SlotCoordinatorEvent.SLOT_EXPIRED, currentSlot, null);
      
      // Create new slot with EXPIRED status
      const nextSlot = await this.createNextSlot(now, lastMeta);
      
      log.info("Created new slot as current one expired", {
        oldEnd: currentSlot.end.toLocaleString(),
        newStart: nextSlot.start.toLocaleString(),
        newEnd: nextSlot.end.toLocaleString()
      });
      
      // Emit event for the new slot
      this.emitEvent(
        SlotCoordinatorEvent.SLOT_CHANGED, 
        nextSlot, 
        SlotStatus.EXPIRED, 
        currentSlot, 
        lastStatus
      );
      
      return { 
        updated: true, 
        currentSlot: nextSlot, 
        lastStatus: SlotStatus.EXPIRED, 
        expired: true,
        reason: "created_new_after_expiry" 
      };
    }
    
    // Slot is still active
    return { 
      updated: false, 
      currentSlot, 
      lastStatus, 
      expired: false,
      reason: "slot_still_active" 
    };
  }
}
