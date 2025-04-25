/**
 * @packageDocumentation
 * @module SlotScheduling
 * 
 * @summary
 * Konstanten für das Slot-Scheduling-System.
 */

import { ITimeConfig } from "./interfaces/ITimeConfig";

/**
 * Konstanten für den Speicher
 */
export const STORAGE_KEYS = {
  /** Schlüssel für die Slots */
  SLOTS: "scheduled_slots",
  
  /** Schlüssel für den aktiven Slot-Index */
  ACTIVE_SLOT_INDEX: "active_slot_index"
};

/**
 * Standard-Konfiguration für die Zeitfenster
 */
export const DEFAULT_TIME_CONFIG: ITimeConfig = {
  /** Zeitfenster für den Morgen (7:30 - 11:30) */
  MORNING_RANGE: { 
    startHour: 7, 
    startMinute: 30, 
    endHour: 10, 
    endMinute: 30 
  },
  
  /** Zeitfenster für den Mittag (11:30 - 16:30) */
  NOON_RANGE: { 
    startHour: 11, 
    startMinute: 30, 
    endHour: 15, 
    endMinute: 0 
  },
  
  /** Zeitfenster für den Abend (16:30 - 21:30) */
  EVENING_RANGE: { 
    startHour: 17, 
    startMinute: 0, 
    endHour: 21, 
    endMinute: 30
  },
  
  /** Länge eines Slots in Minuten */
  SLOT_LENGTH_MINUTES: 60,
  
  /** Mindestabstand zwischen Slots in Minuten */
  MIN_GAP_MINUTES: 180,

  /** Standard-Anzahl von Tagen für den Zeitplan */
  DEFAULT_SCHEDULE_DAYS: 14,
}; 