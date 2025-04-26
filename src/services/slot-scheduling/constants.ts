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
    startHour: 13, 
    startMinute: 35, 
    endHour: 13, 
    endMinute: 40 
  },
  
  /** Zeitfenster für den Mittag (11:30 - 16:30) */
  NOON_RANGE: { 
    startHour: 13, 
    startMinute: 40, 
    endHour: 13, 
    endMinute: 45 
  },
  
  /** Zeitfenster für den Abend (16:30 - 21:30) */
  EVENING_RANGE: { 
    startHour: 13, 
    startMinute: 45, 
    endHour: 13, 
    endMinute: 50
  },
  
  /** Länge eines Slots in Minuten */
  SLOT_LENGTH_MINUTES: 2,
  
  /** Mindestabstand zwischen Slots in Minuten */
  MIN_GAP_MINUTES: 0,

  /** Standard-Anzahl von Umfragen, die zu planen sind */
  DEFAULT_SURVEY_COUNT: 2
}; 