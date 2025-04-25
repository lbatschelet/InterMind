/**
 * @packageDocumentation
 * @module SlotScheduling/Interfaces
 * 
 * @summary
 * Interface für das Slot-Objekt.
 */

import { DaySegment } from "../../../types/slots";

/**
 * Status eines Zeitfensters
 */
export enum SlotStatus {
  PENDING = "PENDING",   // Noch nicht aktiv
  ACTIVE = "ACTIVE",     // Aktuell aktiv
  COMPLETED = "COMPLETED", // Umfrage wurde ausgefüllt
  MISSED = "MISSED"      // Umfrage wurde verpasst
}

/**
 * Zeitfenster für Umfragen
 */
export interface ISlot {
  /** Eindeutige ID des Slots */
  id: string;
  
  /** Startzeit des Slots */
  start: Date;
  
  /** Endzeit des Slots */
  end: Date;
  
  /** Aktueller Status des Slots */
  status: SlotStatus;
  
  /** Tagesabschnitt, zu dem der Slot gehört */
  daySegment: DaySegment;
  
  /** ID der zugehörigen Benachrichtigung (optional) */
  notificationId?: string;
} 