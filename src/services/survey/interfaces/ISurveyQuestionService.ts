/**
 * @packageDocumentation
 * @module Services
 * 
 * @summary
 * Interface für den SurveyQuestionService
 */

import { LanguageCode } from "../../../locales";
import { Question } from "../../../types/question";

/**
 * Interface für den SurveyQuestionService
 * Verantwortlich für die Verwaltung, Filterung und Sortierung von Umfragefragen
 */
export interface ISurveyQuestionService {
  /**
   * Ruft Fragen für eine Umfrage ab und verarbeitet sie.
   * 
   * @param includeAnsweredOnceQuestions Ob bereits beantwortete "showOnce"-Fragen einbezogen werden sollen
   * @param language Die Sprache der Fragen
   * @returns Eine gefilterte und sortierte Liste von Fragen
   */
  getQuestionsForSurvey(includeAnsweredOnceQuestions?: boolean, language?: LanguageCode): Promise<Question[]>;
  
  /**
   * Filtert Fragen basierend auf den aktuellen Antworten.
   * 
   * Implementiert eine bedingte Filterlogik, die Fragen basierend auf den 
   * Antwortauswahlen ausblendet. Bei MultipleChoice gilt eine XOR-Logik.
   * 
   * @param questions Alle verfügbaren Fragen
   * @param responses Aktuelle Antworten im Format { questionId: response }
   * @returns Gefilterte und sortierte Liste von Fragen
   */
  filterQuestionsBasedOnResponses(questions: Question[], responses: Record<string, unknown>): Question[];
  
  /**
   * Bestimmt den geeigneten Index für die Navigation bei geänderter Fragenliste.
   * 
   * @param filteredQuestions Die gefilterte Liste der sichtbaren Fragen
   * @param currentQuestion Die aktuelle Frage
   * @param fallbackIndex Der Standard-Index, falls keine passende Frage gefunden wird
   * @returns Den Index für die nächste Frage in der gefilterten Liste
   */
  findAppropriateQuestionIndex(
    filteredQuestions: Question[],
    currentQuestion: Question | undefined,
    fallbackIndex?: number
  ): number;
  
  /**
   * Prüft, ob die Verzweigungslogik zu Änderungen in der Fragenliste geführt hat,
   * die eine Anpassung des aktuellen Index erfordern könnten.
   * 
   * @param originalQuestions Die ursprüngliche Fragenliste
   * @param filteredQuestions Die gefilterte Fragenliste
   * @param currentIndex Der aktuelle Index
   * @returns true, wenn Anpassungen nötig sind, sonst false
   */
  shouldAdjustNavigation(
    originalQuestions: Question[],
    filteredQuestions: Question[],
    currentIndex: number
  ): boolean;
} 