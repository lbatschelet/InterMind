/**
 * @packageDocumentation
 * @module Services
 * 
 * @summary
 * Interface für den SurveyDataService
 */

/**
 * Interface für den SurveyDataService
 * 
 * Dieser Service ist verantwortlich für:
 * 1. Verwaltung des Datenlebenszyklus der Umfragen
 * 2. Behandlung von Datenlöschung und Zurücksetzungsoperationen
 */
export interface ISurveyDataService {
  /**
   * Löscht alle Umfragedaten, die mit dem aktuellen Gerät verbunden sind.
   * 
   * Dies ist eine Datenverwaltungsfunktion, die:
   * - Alle Umfrageantworten entfernt
   * - Das Tracking beantworteter Fragen zurücksetzt
   * - Benutzer einen Neustart ermöglicht
   * 
   * @returns Boolean, der Erfolg oder Misserfolg anzeigt
   */
  deleteAllSurveys(): Promise<boolean>;
  
  /**
   * Setzt das "showOnce"-Fragen-Tracking zurück, wodurch zuvor beantwortete
   * Fragen wieder in zukünftigen Umfragen erscheinen.
   * 
   * Dies ist primär für Tests oder administrative Zwecke gedacht.
   */
  resetAnsweredOnceQuestions(): Promise<void>;
  
  /**
   * Setzt das gesamte Slot-System zurück.
   * Setzt die gesamte Umfrageplanung, Benachrichtigungen und Slot-bezogene Daten zurück.
   */
  resetSlotSystem(): Promise<void>;
} 