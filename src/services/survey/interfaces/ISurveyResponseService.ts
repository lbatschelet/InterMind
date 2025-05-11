/**
 * @packageDocumentation
 * @module Services
 * 
 * @summary
 * Interface für den SurveyResponseService
 */

import { Question } from "../../../types/question";

/**
 * Interface für den SurveyResponseService
 * Verantwortlich für die Verwaltung von Umfrageantworten
 */
export interface ISurveyResponseService {
  /**
   * Speichert eine Antwort für eine bestimmte Frage.
   * 
   * @param surveyId Die ID der Umfrage
   * @param questionId Die ID der Frage
   * @param response Die Antwort (kann ein beliebiger Wert sein)
   * @returns Promise, das erfüllt wird, wenn die Antwort gespeichert wurde
   */
  submitResponse(surveyId: string, questionId: string, response: unknown): Promise<void>;
  
  /**
   * Markiert Fragen, die nur einmal angezeigt werden sollen, als beantwortet.
   * 
   * @param questionIds Die IDs der beantworteten Fragen
   * @returns Promise, das erfüllt wird, wenn die Fragen markiert wurden
   */
  markShowOnceQuestionsAsAnswered(questionIds: string[]): Promise<void>;
  
  /**
   * Ruft alle Antworten für eine bestimmte Umfrage ab.
   * 
   * @param surveyId Die ID der Umfrage
   * @returns Ein Objekt mit den Frage-IDs als Schlüssel und den Antworten als Werte
   */
  getResponsesForSurvey(surveyId: string): Promise<Record<string, unknown>>;
  
  /**
   * Verarbeitet eine Antwort und wendet bedingte Logik an.
   * 
   * Diese Methode kombiniert die Speicherung der Antwort mit der Anwendung
   * der bedingten Logik zur Ausblendung von Fragen.
   * 
   * @param surveyId Die ID der Umfrage
   * @param questionId Die ID der Frage
   * @param response Die Antwort
   * @param allQuestions Alle verfügbaren Fragen
   * @param currentResponses Der aktuelle Antworten-Cache
   * @returns Die aktualisierten Fragen und Antworten nach Anwendung der bedingten Logik
   */
  processResponse(
    surveyId: string,
    questionId: string,
    response: unknown,
    allQuestions: Question[],
    currentResponses: Record<string, unknown>
  ): Promise<{
    filteredQuestions: Question[];
    updatedResponses: Record<string, unknown>;
  }>;
} 