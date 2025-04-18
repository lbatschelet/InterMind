import AsyncStorage from "@react-native-async-storage/async-storage";
import { createLogger } from "~/src/utils/logger";
import { Slot, SlotMeta, SlotStatus } from "./types";

const log = createLogger("SlotStateStore");

// Storage keys
const SLOT_END_KEY = 'slot_end_time';
const SLOT_STATUS_KEY = 'slot_status';
const CURRENT_SLOT_START_KEY = 'current_slot_start';
const CURRENT_SLOT_END_KEY = 'current_slot_end';

/**
 * SlotStateStore Interface
 * ------------------------
 * 
 * Definiert die Schnittstelle zum Speichern und Lesen von Slot-Zuständen.
 */
export interface SlotStateStore {
  /**
   * Liest die Metadaten des letzten Slots
   * @returns SlotMeta oder null, wenn kein letzter Slot existiert
   */
  readLastMeta(): Promise<SlotMeta | null>;
  
  /**
   * Speichert einen neuen Slot und seinen Status
   * @param slot Der neue Slot
   * @param status Der Status des Slots
   */
  saveSlot(slot: Slot, status: SlotStatus): Promise<void>;
  
  /**
   * Liest den aktuellen Slot, falls vorhanden
   * @returns Der aktuelle Slot oder null
   */
  readCurrentSlot(): Promise<Slot | null>;
  
  /**
   * Prüft, ob die aktuelle Zeit in einem aktiven Slot liegt
   * @returns true, wenn die aktuelle Zeit in einem aktiven Slot liegt
   */
  isInActiveSlot(): Promise<boolean>;
}

/**
 * AsyncStorage-Implementierung des SlotStateStore
 */
export class AsyncStorageSlotStateStore implements SlotStateStore {
  async readLastMeta(): Promise<SlotMeta | null> {
    try {
      const [endStr, statusStr] = await Promise.all([
        AsyncStorage.getItem(SLOT_END_KEY),
        AsyncStorage.getItem(SLOT_STATUS_KEY)
      ]);
      
      if (!endStr || !statusStr) {
        return null;
      }
      
      return {
        end: new Date(endStr),
        status: statusStr as SlotStatus
      };
    } catch (error) {
      log.error("Error reading last slot metadata", error);
      return null;
    }
  }
  
  async saveSlot(slot: Slot, status: SlotStatus): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(CURRENT_SLOT_START_KEY, slot.start.toISOString()),
        AsyncStorage.setItem(CURRENT_SLOT_END_KEY, slot.end.toISOString()),
        AsyncStorage.setItem(SLOT_END_KEY, slot.end.toISOString()),
        AsyncStorage.setItem(SLOT_STATUS_KEY, status)
      ]);
      
      log.info("Saved new slot", { slot, status });
    } catch (error) {
      log.error("Error saving slot", error);
    }
  }
  
  async readCurrentSlot(): Promise<Slot | null> {
    try {
      const [startStr, endStr] = await Promise.all([
        AsyncStorage.getItem(CURRENT_SLOT_START_KEY),
        AsyncStorage.getItem(CURRENT_SLOT_END_KEY)
      ]);
      
      if (!startStr || !endStr) {
        return null;
      }
      
      return {
        start: new Date(startStr),
        end: new Date(endStr)
      };
    } catch (error) {
      log.error("Error reading current slot", error);
      return null;
    }
  }
  
  async isInActiveSlot(): Promise<boolean> {
    try {
      const currentSlot = await this.readCurrentSlot();
      if (!currentSlot) {
        return false;
      }
      
      // Prüfe, ob es sich um einen INITIAL-Slot handelt (erste Umfrage, immer verfügbar)
      const statusStr = await AsyncStorage.getItem(SLOT_STATUS_KEY);
      if (statusStr === SlotStatus.INITIAL) {
        log.debug("Initial survey is always available (permanent slot)");
        return true;
      }
      
      // Normale Zeitprüfung für reguläre Slots
      const now = new Date();
      return now >= currentSlot.start && now < currentSlot.end;
    } catch (error) {
      log.error("Error checking if in active slot", error);
      return false;
    }
  }
} 