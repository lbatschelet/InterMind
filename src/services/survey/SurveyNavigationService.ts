/**
 * @packageDocumentation
 * @module Services
 * 
 * @summary
 * Survey Navigation Service
 */

import { createLogger } from "~/src/utils/logger";
import { Question } from "../../types/question";
import { ISurveyNavigationService } from "./interfaces/ISurveyNavigationService";

const log = createLogger("SurveyNavigationService");

/**
 * Service zur Verwaltung der Navigation zwischen Fragen in einer Umfrage.
 * 
 * Dieser Service extrahiert die Navigationslogik aus dem SurveyScreen und
 * stellt zentrale Methoden für die Navigation bereit.
 */
class SurveyNavigationService implements ISurveyNavigationService {
  /**
   * Berechnet den Index der nächsten Frage basierend auf dem aktuellen Index.
   * 
   * @param currentIndex Der aktuelle Frageindex
   * @param questions Die Liste aller (gefilterten) Fragen
   * @returns Der Index der nächsten Frage oder -1, wenn keine weitere Frage vorhanden ist
   */
  calculateNextIndex(currentIndex: number, questions: Question[]): number {
    if (questions.length === 0) {
      return -1;
    }
    
    // Prüfen, ob wir bereits am Ende sind
    if (currentIndex >= questions.length - 1) {
      return -1;
    }
    
    // Nächster Index
    return currentIndex + 1;
  }
  
  /**
   * Berechnet den Index der vorherigen Frage basierend auf dem aktuellen Index.
   * 
   * @param currentIndex Der aktuelle Frageindex
   * @param questions Die Liste aller (gefilterten) Fragen
   * @returns Der Index der vorherigen Frage oder -1, wenn keine vorherige Frage vorhanden ist
   */
  calculatePreviousIndex(currentIndex: number, questions: Question[]): number {
    if (questions.length === 0) {
      return -1;
    }
    
    // Prüfen, ob wir bereits am Anfang sind
    if (currentIndex <= 0) {
      return -1;
    }
    
    // Vorheriger Index
    return currentIndex - 1;
  }
  
  /**
   * Prüft, ob die Umfrage nach der aktuellen Frage beendet werden sollte.
   * Dies ist der Fall, wenn die aktuelle Frage die letzte Frage in der Liste ist.
   * 
   * @param currentIndex Der aktuelle Frageindex
   * @param questions Die Liste aller (gefilterten) Fragen
   * @returns true, wenn die Umfrage abgeschlossen werden sollte, sonst false
   */
  shouldCompleteOnNext(currentIndex: number, questions: Question[]): boolean {
    if (questions.length === 0) {
      return false;
    }
    
    // Umfrage beenden, wenn wir bei der letzten Frage sind
    return currentIndex >= questions.length - 1;
  }
  
  /**
   * Behandelt die Aktualisierung des Navigationsindex nach Änderungen an der Fragenliste.
   * Dies passiert zum Beispiel, wenn bedingte Logik dazu führt, dass Fragen ausgeblendet werden.
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
  ): number {
    // Prüfe, ob eine Anpassung des Index nötig ist
    if (!this.shouldAdjustNavigation(allQuestions, filteredQuestions, currentIndex)) {
      return currentIndex;
    }
    
    // Berechne den geeigneten Index für die Navigation
    return this.findAppropriateQuestionIndex(filteredQuestions, currentQuestion, 0);
  }

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
  ): boolean {
    // Wenn keine Fragen vorhanden sind, keine Anpassung nötig
    if (originalQuestions.length === 0 || filteredQuestions.length === 0) {
      return false;
    }
    
    // Wenn der aktuelle Index außerhalb des Bereichs liegt, Anpassung nötig
    if (currentIndex >= filteredQuestions.length) {
      return true;
    }
    
    // Prüfen, ob die Frage am aktuellen Index in beiden Listen identisch ist
    if (currentIndex < originalQuestions.length) {
      const currentOriginalQuestion = originalQuestions[currentIndex];
      const currentFilteredQuestion = filteredQuestions[currentIndex];
      
      // Wenn die Fragen unterschiedlich sind, Anpassung nötig
      if (currentOriginalQuestion.id !== currentFilteredQuestion.id) {
        return true;
      }
    }
    
    // Keine Anpassung nötig
    return false;
  }

  /**
   * Bestimmt den geeigneten Index für die Navigation bei geänderter Fragenliste.
   * 
   * Diese Methode wird verwendet, wenn sich die Fragenliste aufgrund von Antworten ändert
   * und der aktuelle Index möglicherweise nicht mehr gültig ist. Sie sucht die nächste 
   * sichtbare Frage nach der aktuellen Frage (basierend auf sequence_number).
   * 
   * @param filteredQuestions Die gefilterte Liste der sichtbaren Fragen
   * @param currentQuestion Die aktuelle Frage
   * @param fallbackIndex Der Standard-Index, der verwendet wird, wenn keine passende Frage gefunden wird
   * @returns Den Index für die nächste Frage in der gefilterten Liste
   */
  findAppropriateQuestionIndex(
    filteredQuestions: Question[],
    currentQuestion: Question | undefined,
    fallbackIndex: number = 0
  ): number {
    // Wenn keine aktuelle Frage vorhanden oder die Fragenliste leer ist, Fallback verwenden
    if (!currentQuestion || filteredQuestions.length === 0) {
      return fallbackIndex;
    }
    
    // Prüfen, ob die aktuelle Frage noch in der gefilterten Liste vorhanden ist
    const currentQuestionStillVisible = filteredQuestions.some(q => q.id === currentQuestion.id);
    
    // Wenn die aktuelle Frage noch sichtbar ist, aktuellen Index verwenden
    if (currentQuestionStillVisible) {
      // Index der aktuellen Frage in der gefilterten Liste finden
      const indexInFilteredList = filteredQuestions.findIndex(q => q.id === currentQuestion.id);
      log.debug("Current question is still visible in filtered list", { 
        index: indexInFilteredList, 
        questionId: currentQuestion.id 
      });
      return indexInFilteredList;
    }
    
    // Aktuelle Frage ist nicht mehr sichtbar, nächste passende Frage finden
    // Wir verwenden sequence_number, um die nächste Frage in der logischen Reihenfolge zu finden
    const currentSeq = currentQuestion.sequence_number || 0;
    
    // Finde die nächste Frage mit einer höheren sequence_number
    const nextVisibleIndex = filteredQuestions.findIndex(q => 
      (q.sequence_number || 0) > currentSeq
    );
    
    // Wenn eine passende Frage gefunden wurde, diesen Index zurückgeben
    if (nextVisibleIndex >= 0) {
      log.debug("Found next visible question after hidden current question", {
        currentQuestionId: currentQuestion.id,
        nextQuestionId: filteredQuestions[nextVisibleIndex].id,
        index: nextVisibleIndex
      });
      return nextVisibleIndex;
    }
    
    // Keine passende Frage gefunden, Fallback verwenden
    log.debug("No suitable next question found, using fallback index", { 
      fallbackIndex,
      currentQuestionId: currentQuestion.id
    });
    return fallbackIndex;
  }
}

/**
 * Singleton-Instanz für die OOP-Nutzung
 */
export const navigationService = new SurveyNavigationService();

/**
 * Default-Export der Klasse für die Instanziierung
 */
export default SurveyNavigationService; 