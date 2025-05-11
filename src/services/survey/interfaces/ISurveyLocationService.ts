/**
 * @packageDocumentation
 * @module Services
 * 
 * @summary
 * Interface für den SurveyLocationService
 */

/**
 * Interface für den SurveyLocationService
 * 
 * Dieser Service ist verantwortlich für:
 * 1. Erfassung des Standorts des Benutzers während einer Umfrage
 * 2. Aktualisierung des Umfragedatensatzes mit Standortdaten
 */
export interface ISurveyLocationService {
  /**
   * Erfasst Standortdaten für eine Umfrage, wenn Berechtigungen erteilt wurden
   * und die Fragensequenznummer >= 100 ist
   * 
   * @param surveyId ID der aktuellen Umfrage
   * @param questionSequenceNumber Die Sequenznummer der aktuellen Frage
   * @returns Boolean, der angibt, ob der Standort erfolgreich erfasst wurde
   */
  captureLocationIfEligible(surveyId: string, questionSequenceNumber: number): Promise<boolean>;
} 