/**
 * @packageDocumentation
 * @module SlotScheduling/Interfaces
 * 
 * @summary
 * Interface für die Slot-Persistenz.
 */

import { ISlot } from "./ISlot";

/**
 * Speicher für Slots
 * Zuständig für die Persistierung von Slot-Daten
 */
export interface ISlotStorage {
  /**
   * Speichert eine Liste von Slots
   * 
   * @param slots Die zu speichernden Slots
   * @returns Promise, das aufgelöst wird, wenn die Speicherung abgeschlossen ist
   */
  saveSlots(slots: ISlot[]): Promise<void>;
  
  /**
   * Lädt alle gespeicherten Slots
   * 
   * @returns Promise mit einem Array von Slots oder null, wenn keine Slots gespeichert sind
   */
  loadSlots(): Promise<ISlot[] | null>;
  
  /**
   * Speichert den Index des aktuell aktiven Slots
   * 
   * @param index Der zu speichernde Index
   * @returns Promise, das aufgelöst wird, wenn die Speicherung abgeschlossen ist
   */
  saveActiveSlotIndex(index: number): Promise<void>;
  
  /**
   * Lädt den Index des aktuell aktiven Slots
   * 
   * @returns Promise mit dem gespeicherten Index oder -1, wenn kein Index gespeichert ist
   */
  loadActiveSlotIndex(): Promise<number>;
  
  /**
   * Löscht alle Slot-Daten
   * 
   * @returns Promise, das aufgelöst wird, wenn die Daten gelöscht wurden
   */
  clearAll(): Promise<void>;
} 