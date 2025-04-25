/**
 * @packageDocumentation
 * @module SlotScheduling/Implementation
 * 
 * @summary
 * Implementierung der Slot-Persistenz mit AsyncStorage.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ISlot } from "../interfaces/ISlot";
import { ISlotStorage } from "../interfaces/ISlotStorage";
import { STORAGE_KEYS } from "../constants";
import { createLogger } from "../../../utils/logger";

const log = createLogger("AsyncStorageSlotStorage");

/**
 * AsyncStorage-basierte Implementierung der Slot-Persistenz
 */
export class AsyncStorageSlotStorage implements ISlotStorage {
  /**
   * Speichert eine Liste von Slots
   * 
   * @param slots Die zu speichernden Slots
   * @returns Promise, das aufgelöst wird, wenn die Speicherung abgeschlossen ist
   */
  async saveSlots(slots: ISlot[]): Promise<void> {
    try {
      if (!STORAGE_KEYS.SLOTS) {
        log.error("STORAGE_KEYS.SLOTS is not defined");
        throw new Error("STORAGE_KEYS.SLOTS is not defined");
      }
      
      const serializedSlots = JSON.stringify(slots.map(slot => ({
        ...slot,
        start: slot.start.toISOString(),
        end: slot.end.toISOString()
      })));
      
      await AsyncStorage.setItem(STORAGE_KEYS.SLOTS, serializedSlots);
      log.info("Slots saved", { count: slots.length });
    } catch (e) {
      log.error("Failed to save slots", e);
      throw e;
    }
  }
  
  /**
   * Lädt alle gespeicherten Slots
   * 
   * @returns Promise mit einem Array von Slots oder null, wenn keine Slots gespeichert sind
   */
  async loadSlots(): Promise<ISlot[] | null> {
    try {
      if (!STORAGE_KEYS.SLOTS) {
        log.error("STORAGE_KEYS.SLOTS is not defined");
        return null;
      }
      
      const serializedSlots = await AsyncStorage.getItem(STORAGE_KEYS.SLOTS);
      if (!serializedSlots) return null;
      
      const parsedSlots = JSON.parse(serializedSlots);
      const slots = parsedSlots.map((slot: any) => ({
        ...slot,
        start: new Date(slot.start),
        end: new Date(slot.end)
      }));
      
      log.info("Slots loaded", { count: slots.length });
      return slots;
    } catch (e) {
      log.error("Failed to load slots", e);
      return null;
    }
  }
  
  /**
   * Speichert den Index des aktuell aktiven Slots
   * 
   * @param index Der zu speichernde Index
   * @returns Promise, das aufgelöst wird, wenn die Speicherung abgeschlossen ist
   */
  async saveActiveSlotIndex(index: number): Promise<void> {
    try {
      if (!STORAGE_KEYS.ACTIVE_SLOT_INDEX) {
        log.error("STORAGE_KEYS.ACTIVE_SLOT_INDEX is not defined");
        throw new Error("STORAGE_KEYS.ACTIVE_SLOT_INDEX is not defined");
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_SLOT_INDEX, index.toString());
      log.debug("Active slot index saved", { index });
    } catch (e) {
      log.error("Failed to save active slot index", e);
      throw e;
    }
  }
  
  /**
   * Lädt den Index des aktuell aktiven Slots
   * 
   * @returns Promise mit dem gespeicherten Index oder -1, wenn kein Index gespeichert ist
   */
  async loadActiveSlotIndex(): Promise<number> {
    try {
      if (!STORAGE_KEYS.ACTIVE_SLOT_INDEX) {
        log.error("STORAGE_KEYS.ACTIVE_SLOT_INDEX is not defined");
        return -1;
      }
      
      const indexStr = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_SLOT_INDEX);
      const index = indexStr ? parseInt(indexStr, 10) : -1;
      log.debug("Active slot index loaded", { index });
      return index;
    } catch (e) {
      log.error("Failed to load active slot index", e);
      return -1;
    }
  }
  
  /**
   * Löscht alle Slot-Daten
   * 
   * @returns Promise, das aufgelöst wird, wenn die Daten gelöscht wurden
   */
  async clearAll(): Promise<void> {
    try {
      if (!STORAGE_KEYS.SLOTS || !STORAGE_KEYS.ACTIVE_SLOT_INDEX) {
        log.error("STORAGE_KEYS are not defined");
        throw new Error("STORAGE_KEYS are not defined");
      }
      
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.SLOTS,
        STORAGE_KEYS.ACTIVE_SLOT_INDEX
      ]);
      log.info("All slot data cleared");
    } catch (e) {
      log.error("Failed to clear slot data", e);
      throw e;
    }
  }
} 