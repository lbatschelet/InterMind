/**
 * @packageDocumentation
 * @module Services
 * 
 * @summary
 * Interface für den SurveyNavigationService
 */

import { Question } from "../../../types/question";

/**
 * Interface für den SurveyNavigationService
 * Verantwortlich für die Navigation zwischen Fragen in einer Umfrage
 */
export interface ISurveyNavigationService {
  /**
   * Berechnet den Index der nächsten Frage basierend auf dem aktuellen Index.
   * 
   * @param currentIndex Der aktuelle Frageindex
   * @param questions Die Liste aller (gefilterten) Fragen
   * @returns Der Index der nächsten Frage oder -1, wenn keine weitere Frage vorhanden ist
   */
  calculateNextIndex(currentIndex: number, questions: Question[]): number;
  
  /**
   * Berechnet den Index der vorherigen Frage basierend auf dem aktuellen Index.
   * 
   * @param currentIndex Der aktuelle Frageindex
   * @param questions Die Liste aller (gefilterten) Fragen
   * @returns Der Index der vorherigen Frage oder -1, wenn keine vorherige Frage vorhanden ist
   */
  calculatePreviousIndex(currentIndex: number, questions: Question[]): number;
  
  /**
   * Prüft, ob die Umfrage nach der aktuellen Frage beendet werden sollte.
   * 
   * @param currentIndex Der aktuelle Frageindex
   * @param questions Die Liste aller (gefilterten) Fragen
   * @returns true, wenn die Umfrage abgeschlossen werden sollte, sonst false
   */
  shouldCompleteOnNext(currentIndex: number, questions: Question[]): boolean;
  
  /**
   * Behandelt die Aktualisierung des Navigationsindex nach Änderungen an der Fragenliste.
   * 
   * @param allQuestions Alle ursprünglichen Fragen
   * @param filteredQuestions Die gefilterte Liste von Fragen
   * @param currentIndex Der aktuelle Frageindex
   * @param currentQuestion Die aktuelle Frage
   * @returns Der aktualisierte Index basierend auf den Filteränderungen
   */
  handleFilteredQuestionsUpdate(
    allQuestions: Question[],
    filteredQuestions: Question[],
    currentIndex: number, 
    currentQuestion: Question | undefined
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
} 