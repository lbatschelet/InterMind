/**
 * Slot-System Type Definitions
 * ---------------------------
 * 
 * Contains the core structures for the Slot-Management-System.
 */

/**
 * A time window during which a survey is available
 */
export interface Slot {
  start: Date;
  end: Date;
}

/**
 * Status of the last slot
 */
export enum SlotStatus {
  FIRST_COMPLETED = 'FIRST_COMPLETED',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
  INITIAL = 'INITIAL',
}

/**
 * Metadata for the last slot
 */
export interface SlotMeta {
  end: Date;
  status: SlotStatus;
}

/**
 * Time range for day segments
 */
export interface TimeRange {
  name: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

/**
 * Configuration for the SlotManager
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
 * Day segment (Morning, Noon, Evening, Night)
 */
export enum DaySegment {
  MORNING = 'MORNING',
  NOON = 'NOON',
  EVENING = 'EVENING',
}

/**
 * Domain events for the slot system
 */
export enum SurveyEvent {
  SURVEY_COMPLETED = 'SURVEY_COMPLETED',
  SURVEY_EXPIRED = 'SURVEY_EXPIRED',
  FIRST_SURVEY_COMPLETED = 'FIRST_SURVEY_COMPLETED',
}

/**
 * Helper method to convert SurveyEvent to SlotStatus
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