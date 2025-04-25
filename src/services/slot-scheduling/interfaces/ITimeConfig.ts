/**
 * @packageDocumentation
 * @module SlotScheduling/Interfaces
 * 
 * @summary
 * Interface für die Zeitkonfiguration.
 */

/**
 * Konfiguration für ein Zeitfenster
 */
export interface TimeRange {
  /** Startstunde des Zeitfensters */
  startHour: number;
  
  /** Startminute des Zeitfensters */
  startMinute: number;
  
  /** Endstunde des Zeitfensters */
  endHour: number;
  
  /** Endminute des Zeitfensters */
  endMinute: number;
}

/**
 * Konfiguration für die zeitlichen Einstellungen des Slot-Systems
 */
export interface ITimeConfig {
  /** Zeitfenster für Morgen-Slots */
  MORNING_RANGE: TimeRange;
  
  /** Zeitfenster für Mittag-Slots */
  NOON_RANGE: TimeRange;
  
  /** Zeitfenster für Abend-Slots */
  EVENING_RANGE: TimeRange;
  
  /** Länge eines Slots in Minuten */
  SLOT_LENGTH_MINUTES: number;
  
  /** Mindestabstand zwischen Slots in Minuten */
  MIN_GAP_MINUTES: number;

  /** Standard-Anzahl von Tagen für den Zeitplan */
  DEFAULT_SCHEDULE_DAYS: number;
} 