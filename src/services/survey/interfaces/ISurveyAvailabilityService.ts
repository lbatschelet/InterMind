/**
 * @packageDocumentation
 * @module Services
 * 
 * @summary
 * Interface für den SurveyAvailabilityService
 */

/**
 * Interface für den SurveyAvailabilityService
 * 
 * Dieser Service ist verantwortlich für:
 * 1. Prüfen, ob eine Umfrage aktuell verfügbar ist
 * 2. Verwaltung zeitbasierter Verfügbarkeitsbeschränkungen
 * 3. Delegation an das Slot-System
 */
export interface ISurveyAvailabilityService {
  /**
   * Prüft, ob eine Umfrage aktuell verfügbar ist.
   * 
   * Die erste Umfrage ist immer verfügbar.
   * Spätere Umfragen werden durch das Slot-System gesteuert.
   * 
   * @returns Promise mit boolean (true, wenn eine Umfrage verfügbar ist)
   */
  isSurveyAvailable(): Promise<boolean>;
} 