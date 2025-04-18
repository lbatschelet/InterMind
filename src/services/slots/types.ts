/**
 * Slot-System Typdefinitionen
 * ---------------------------
 * 
 * Enthält die Grundstrukturen für das Slot-Management-System.
 */

/**
 * Ein Zeitfenster, in dem eine Umfrage verfügbar ist
 */
export interface Slot {
  start: Date;
  end: Date;
}

/**
 * Status des letzten Slots
 */
export enum SlotStatus {
  FIRST_COMPLETED = 'FIRST_COMPLETED',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  INITIAL = 'INITIAL',
}

/**
 * Metadaten zum letzten Slot
 */
export interface SlotMeta {
  end: Date;
  status: SlotStatus;
}

/**
 * Zeitbereich für Tagesabschnitte
 */
export interface TimeRange {
  name: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

/**
 * Konfiguration für den SlotManager
 */
export interface SlotManagerConfig {
  MORNING_RANGE: TimeRange;
  NOON_RANGE: TimeRange;
  EVENING_RANGE: TimeRange;
  SLOT_LENGTH_MINUTES: number;
  TIME_GRANULARITY_MINUTES: number;
  MIN_GAP_COMPLETED_MINUTES: number;
  MIN_GAP_EXPIRED_MINUTES: number;
}

/**
 * Segment des Tages (Morgen, Mittag, Abend)
 */
export enum DaySegment {
  MORNING = 'MORNING',
  NOON = 'NOON',
  EVENING = 'EVENING',
}

/**
 * Domain-Events für das Slot-System
 */
export enum SurveyEvent {
  SURVEY_COMPLETED = 'SURVEY_COMPLETED',
  SURVEY_EXPIRED = 'SURVEY_EXPIRED',
  FIRST_SURVEY_COMPLETED = 'FIRST_SURVEY_COMPLETED',
}

/**
 * Hilfsmethode, um SurveyEvent in SlotStatus umzuwandeln
 */
export function eventToStatus(event: SurveyEvent): SlotStatus {
  switch (event) {
    case SurveyEvent.SURVEY_COMPLETED:
      return SlotStatus.COMPLETED;
    case SurveyEvent.SURVEY_EXPIRED:
      return SlotStatus.EXPIRED;
    case SurveyEvent.FIRST_SURVEY_COMPLETED:
      return SlotStatus.FIRST_COMPLETED;
  }
} 