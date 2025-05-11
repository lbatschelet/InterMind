/**
 * @packageDocumentation
 * @module Services
 * 
 * @summary
 * Interface für den SurveySessionService
 */

import { LanguageCode } from "../../../locales";
import { Question } from "../../../types/question";

/**
 * Interface für den SurveySessionService
 * 
 * Dieser Service ist verantwortlich für:
 * 1. Erstellung und Verwaltung von Umfragesitzungen
 * 2. Starten und Abschließen von Umfragesitzungen
 */
export interface ISurveySessionService {
  /**
   * Startet eine neue Umfragesitzung.
   * 
   * Diese Methode:
   * 1. Erstellt eine neue Umfragesitzung mit Geräte-ID
   * 2. Ruft Fragen über den QuestionService ab und verarbeitet sie
   * 3. Gibt die Daten zurück, die für die Präsentation der Umfrage benötigt werden
   * 
   * @param includeAnsweredOnceQuestions Ob Fragen, die als beantwortet markiert sind, eingeschlossen werden sollen (für Debugging/Admin)
   * @param language Der Sprachcode, der für das Abrufen lokalisierter Fragen verwendet werden soll
   * @returns Objekt mit Umfrage-ID und Fragen-Array
   * @throws Error, wenn die Umfrageerstellung fehlschlägt
   */
  startSurvey(includeAnsweredOnceQuestions?: boolean, language?: LanguageCode): Promise<{ surveyId: string; questions: Question[] }>;
  
  /**
   * Markiert eine Umfrage als abgeschlossen und delegiert an den SurveyLifecycleService.
   * 
   * @param surveyId Die eindeutige Kennung der abgeschlossenen Umfrage
   * @param answeredQuestions Array von Question-Objekten, die beantwortet wurden
   */
  completeSurvey(surveyId: string, answeredQuestions?: Question[]): Promise<void>;
} 