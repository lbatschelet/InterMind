import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot, SlotMeta, SlotStatus } from "../../types/slots";
import { createLogger } from "../../utils/logger";

/* -------------------------------------------------------------------------
 * SlotStateStore – persistence gateway for the current slot + its status.
 *
 *  ✦  All public method signatures are **identical** to the legacy class – you
 *     can replace the file and re‑build without touching any caller.
 *  ✦  Storage format simplified: each logical record is written in **one**
 *     AsyncStorage.multiSet() call to minimise partial‑write risk.
 *  ✦  Legacy keys are still written / read so existing installations migrate
 *     automatically.
 * -------------------------------------------------------------------------*/

const log = createLogger("SlotStateStore");

/* Legacy key names (kept for backward compatibility) */
const LEGACY_SLOT_START_KEY   = "current_slot_start";
const LEGACY_SLOT_END_KEY     = "current_slot_end";
const LEGACY_SLOT_END_META    = "slot_end_time";
const LEGACY_STATUS_KEY       = "slot_status";

/* New compact keys */
const SLOT_JSON_KEY           = "slot_current_json";   // {start,end}
const STATUS_KEY              = "slot_current_status"; // SlotStatus

/* ----------------------------------------------------------------------------
 * Interface (unchanged)
 * --------------------------------------------------------------------------*/
export interface SlotStateStore {
  readLastMeta(): Promise<SlotMeta | null>;
  saveSlot(slot: Slot, status: SlotStatus): Promise<void>;
  readCurrentSlot(): Promise<Slot | null>;
  isInActiveSlot(): Promise<boolean>;
}

/* ----------------------------------------------------------------------------
 * Implementation
 * --------------------------------------------------------------------------*/
export class AsyncStorageSlotStateStore implements SlotStateStore {
  /* ──────────────────────────  readLastMeta  ────────────────────────── */
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

      // Fallback to legacy keys (true drop‑in)
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

  /* ─────────────────────────────  saveSlot  ─────────────────────────── */
  async saveSlot(slot: Slot, status: SlotStatus): Promise<void> {
    try {
      const payload: [string, string][] = [
        [SLOT_JSON_KEY, JSON.stringify({ start: slot.start.toISOString(), end: slot.end.toISOString() })],
        [STATUS_KEY, status],
      ];

      // Also write legacy keys for 100 % drop‑in compatibility *and* for tests
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

  /* ──────────────────────────  readCurrentSlot  ─────────────────────── */
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

  /* ──────────────────────────  isInActiveSlot  ──────────────────────── */
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
