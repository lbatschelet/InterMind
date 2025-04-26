/**
 * @packageDocumentation
 * @module SlotScheduling/Interfaces
 * 
 * @summary
 * Interface für den Haupt-Slot-Service.
 */

import { ISlot, SlotStatus } from "./ISlot";

/**
 * Events, die vom Slot-Service ausgelöst werden
 */
export enum SlotServiceEvent {
  /** Ein Slot wurde aktiviert */
  SLOT_ACTIVATED = "slot_activated",
  
  /** Ein Slot wurde abgeschlossen */
  SLOT_COMPLETED = "slot_completed",
  
  /** Ein Slot wurde verpasst */
  SLOT_MISSED = "slot_missed",
  
  /** Ein neuer Zeitplan wurde erstellt */
  SCHEDULE_CREATED = "schedule_created"
}

/**
 * Haupt-Service für das Slot-System
 * Koordiniert die verschiedenen Komponenten und stellt die öffentliche API bereit
 */
export interface ISlotService {
  /**
   * Registriert einen Event-Listener
   * 
   * @param event Das zu überwachende Ereignis
   * @param listener Die Callback-Funktion, die aufgerufen wird
   * @returns This-Referenz für Method Chaining
   */
  on(event: SlotServiceEvent, listener: (slot: ISlot) => void): this;
  
  /**
   * Entfernt einen Event-Listener
   * 
   * @param event Das Ereignis
   * @param listener Die zu entfernende Callback-Funktion
   * @returns This-Referenz für Method Chaining
   */
  off(event: SlotServiceEvent, listener: (slot: ISlot) => void): this;
  
  /**
   * Initialisiert den Slot-Service
   * 
   * @returns Promise, das aufgelöst wird, wenn die Initialisierung abgeschlossen ist
   */
  initialize(): Promise<void>;
  
  /**
   * Prüft, ob aktuell eine Umfrage verfügbar ist
   * 
   * @returns Promise mit true, wenn eine Umfrage verfügbar ist, sonst false
   */
  isCurrentlyAvailable(): Promise<boolean>;
  
  /**
   * Markiert den aktuellen Slot als abgeschlossen
   * 
   * @returns Promise mit dem nächsten anstehenden Slot oder null, wenn keiner mehr kommt
   */
  markCurrentSlotCompleted(): Promise<ISlot | null>;
  
  /**
   * Liefert den aktuell aktiven Slot
   * 
   * @returns Promise mit dem aktiven Slot oder null, wenn keiner aktiv ist
   */
  getActiveSlot(): Promise<ISlot | null>;
  
  /**
   * Liefert alle Slots
   * 
   * @returns Array aller Slots
   */
  getAllSlots(): ISlot[];
  
  /**
   * Liefert den nächsten anstehenden Slot
   * 
   * @returns Der nächste anstehende Slot oder null, wenn keiner mehr kommt
   */
  getNextPendingSlot(): ISlot | null;
  
  /**
   * Setzt das gesamte System zurück und generiert einen neuen Zeitplan
   * 
   * @returns Promise, das aufgelöst wird, wenn das System zurückgesetzt wurde
   */
  reset(): Promise<void>;
} 