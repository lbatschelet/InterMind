/**
 * @packageDocumentation
 * @module Services/Slots
 * 
 * @summary
 * Persistence layer for slot state and status information.
 * 
 * @remarks
 * Provides storage functionality for the slot-based survey system.
 * Abstracts the storage mechanism and handles compatibility with legacy formats.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot, SlotMeta, SlotStatus } from "../../types/slots";
import { createLogger } from "../../utils/logger";

/**
 * SlotStateStore - Persistence gateway for the current slot and its status.
 *
 * @category Core Documentation
 * 
 * @remarks
 * Features:
 * - All public method signatures are identical to the legacy class - you
 *   can replace the file and rebuild without touching any caller.
 * - Storage format simplified: each logical record is written in one
 *   AsyncStorage.multiSet() call to minimize partial-write risk.
 * - Legacy keys are still written/read so existing installations migrate
 *   automatically.
 */

const log = createLogger("SlotStateStore");

/** 
 * Legacy key names (kept for backward compatibility) 
 * 
 * @category Configuration
 */
const LEGACY_SLOT_START_KEY   = "current_slot_start";
const LEGACY_SLOT_END_KEY     = "current_slot_end";
const LEGACY_SLOT_END_META    = "slot_end_time";
const LEGACY_STATUS_KEY       = "slot_status";

/** 
 * New compact keys 
 * 
 * @category Configuration
 */
const SLOT_JSON_KEY           = "slot_current_json";   // {start,end}
const STATUS_KEY              = "slot_current_status"; // SlotStatus

/**
 * Interface for SlotStateStore implementations.
 * Provides methods to read and write slot data to persistent storage.
 * 
 * @category Interface
 * 
 * @example
 * ```typescript
 * // Implementing a custom slot store
 * class MyCustomSlotStore implements SlotStateStore {
 *   async readLastMeta(): Promise<SlotMeta | null> {
 *     // Custom implementation
 *   }
 *   
 *   async saveSlot(slot: Slot, status: SlotStatus): Promise<void> {
 *     // Custom implementation
 *   }
 *   
 *   // ... other methods
 * }
 * ```
 */
export interface SlotStateStore {
  /**
   * Reads metadata about the last slot from storage.
   * 
   * @returns Promise resolving to SlotMeta object or null if none exists
   */
  readLastMeta(): Promise<SlotMeta | null>;
  
  /**
   * Saves a slot with its status to storage.
   * 
   * @param slot - The slot to save
   * @param status - The status of the slot
   * @returns Promise that resolves when the save is complete
   */
  saveSlot(slot: Slot, status: SlotStatus): Promise<void>;
  
  /**
   * Reads the current slot from storage.
   * 
   * @returns Promise resolving to Slot object or null if none exists
   */
  readCurrentSlot(): Promise<Slot | null>;
  
  /**
   * Checks if the current time is within an active slot.
   * 
   * @returns Promise resolving to true if in an active slot
   */
  isInActiveSlot(): Promise<boolean>;
}

/**
 * Implementation of SlotStateStore using AsyncStorage.
 * Handles both new compact storage format and legacy format for backward compatibility.
 * 
 * @category Implementation
 * 
 * @example
 * ```typescript
 * // Create and use a slot store
 * const slotStore = new AsyncStorageSlotStateStore();
 * 
 * // Save a slot
 * await slotStore.saveSlot(
 *   { start: new Date(), end: new Date(Date.now() + 3600000) },
 *   SlotStatus.ACTIVE
 * );
 * 
 * // Check if in active slot
 * const isActive = await slotStore.isInActiveSlot();
 * ```
 */
export class AsyncStorageSlotStateStore implements SlotStateStore {
  /**
   * Reads metadata about the last slot from storage.
   * Tries the new compact format first, then falls back to legacy keys.
   * 
   * @returns Promise resolving to SlotMeta object or null if none exists
   * 
   * @example
   * ```typescript
   * const meta = await slotStore.readLastMeta();
   * if (meta) {
   *   console.log(`Last slot ended at ${meta.end} with status ${meta.status}`);
   * }
   * ```
   */
  async readLastMeta(): Promise<SlotMeta | null> {
    try {
      // Try new compact format first
      const [[, json], [, statusStr]] = await AsyncStorage.multiGet([
        SLOT_JSON_KEY,
        STATUS_KEY,
      ]);

      if (json && statusStr) {
        const { end } = JSON.parse(json) as { end: string };
        return { end: new Date(end), status: statusStr as SlotStatus };
      }

      // Fallback to legacy keys (true drop-in)
      const [endLegacy, statusLegacy] = await AsyncStorage.multiGet([
        LEGACY_SLOT_END_META,
        LEGACY_STATUS_KEY,
      ]);
      const endStr = endLegacy[1];
      const status = statusLegacy[1];
      return endStr && status ? { end: new Date(endStr), status: status as SlotStatus } : null;
    } catch (e) {
      log.error("readLastMeta failed", e);
      return null;
    }
  }

  /**
   * Saves a slot with its status to storage.
   * Writes both new compact format and legacy keys for compatibility.
   * 
   * @param slot - The slot to save
   * @param status - The status of the slot
   * @returns Promise that resolves when the save is complete
   * 
   * @example
   * ```typescript
   * // Save a new slot
   * await slotStore.saveSlot(
   *   { 
   *     start: new Date(), 
   *     end: new Date(Date.now() + 3600000) // 1 hour from now
   *   },
   *   SlotStatus.ACTIVE
   * );
   * ```
   */
  async saveSlot(slot: Slot, status: SlotStatus): Promise<void> {
    try {
      const payload: [string, string][] = [
        [SLOT_JSON_KEY, JSON.stringify({ start: slot.start.toISOString(), end: slot.end.toISOString() })],
        [STATUS_KEY, status],
      ];

      // Also write legacy keys for 100% drop-in compatibility and for tests
      payload.push(
        [LEGACY_SLOT_START_KEY, slot.start.toISOString()],
        [LEGACY_SLOT_END_KEY, slot.end.toISOString()],
        [LEGACY_SLOT_END_META, slot.end.toISOString()],
        [LEGACY_STATUS_KEY, status],
      );

      await AsyncStorage.multiSet(payload);
      log.info("Slot saved", { slot, status });
    } catch (e) {
      log.error("saveSlot failed", e);
    }
  }

  /**
   * Reads the current slot from storage.
   * Tries the new compact format first, then falls back to legacy keys.
   * 
   * @returns Promise resolving to Slot object or null if none exists
   * 
   * @example
   * ```typescript
   * const currentSlot = await slotStore.readCurrentSlot();
   * if (currentSlot) {
   *   const timeLeft = currentSlot.end.getTime() - Date.now();
   *   console.log(`Slot ends in ${timeLeft / 60000} minutes`);
   * }
   * ```
   */
  async readCurrentSlot(): Promise<Slot | null> {
    try {
      const [[, json]] = await AsyncStorage.multiGet([SLOT_JSON_KEY]);
      if (json) {
        const { start, end } = JSON.parse(json) as { start: string; end: string };
        return { start: new Date(start), end: new Date(end) };
      }

      // Legacy fallback
      const [[, startStr], [, endStr]] = await AsyncStorage.multiGet([
        LEGACY_SLOT_START_KEY,
        LEGACY_SLOT_END_KEY,
      ]);
      if (!startStr || !endStr) return null;
      return { start: new Date(startStr), end: new Date(endStr) };
    } catch (e) {
      log.error("readCurrentSlot failed", e);
      return null;
    }
  }

  /**
   * Checks if the current time is within an active slot.
   * INITIAL slots are always considered active.
   * 
   * @returns Promise resolving to true if in an active slot
   * 
   * @example
   * ```typescript
   * // Check if we're in an active slot
   * if (await slotStore.isInActiveSlot()) {
   *   // Show survey
   *   showSurvey();
   * } else {
   *   // Hide survey
   *   hideSurvey();
   * }
   * ```
   */
  async isInActiveSlot(): Promise<boolean> {
    try {
      const [slot, statusStr] = await Promise.all([
        this.readCurrentSlot(),
        AsyncStorage.getItem(STATUS_KEY),
      ]);

      if (!slot) return false;
      if (statusStr === SlotStatus.INITIAL) return true; // permanent survey

      const now = Date.now();
      return now >= slot.start.getTime() && now < slot.end.getTime();
    } catch (e) {
      log.error("isInActiveSlot failed", e);
      return false;
    }
  }
}
