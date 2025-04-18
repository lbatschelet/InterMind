import { LanguageCode } from "../../locales";

/**
 * Interface für die Verwaltung von Umfragen-Entitäten
 */
export interface ISurveyRepository {
  /**
   * Erstellt eine neue Umfrage
   * @param deviceId Die Geräte-ID, der die Umfrage zugeordnet wird
   * @param language Der Sprachcode für die Umfrage
   * @returns Die ID der neuen Umfrage
   */
  createSurvey(deviceId: string, language: LanguageCode): Promise<string>;
  
  /**
   * Markiert eine Umfrage als abgeschlossen
   * @param surveyId Die ID der abzuschließenden Umfrage
   */
  completeSurvey(surveyId: string): Promise<void>;
  
  /**
   * Löscht alle Umfragen für ein bestimmtes Gerät
   * @param deviceId Die Geräte-ID, für die alle Umfragen gelöscht werden sollen
   * @returns True, wenn das Löschen erfolgreich war
   */
  deleteAllSurveys(deviceId: string): Promise<boolean>;
  
  /**
   * Prüft, ob ein Gerät abgeschlossene Umfragen hat
   * @param deviceId Die zu prüfende Geräte-ID
   * @returns True, wenn das Gerät mindestens eine abgeschlossene Umfrage hat
   */
  hasCompletedSurveys(deviceId: string): Promise<boolean>;
} 