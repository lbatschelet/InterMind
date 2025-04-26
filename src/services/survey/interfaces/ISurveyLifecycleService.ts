/**
 * @packageDocumentation
 * @module Services
 * 
 * @summary
 * Interface für den Survey Lifecycle Service
 */

import { SurveyType } from '../SurveyLifecycleService';

/**
 * Interface für den Survey Lifecycle Service
 * Verantwortlich für die Steuerung des Lebenszyklus von Umfragen
 */
export interface ISurveyLifecycleService {
  /**
   * Prüft, ob die erste Umfrage angezeigt werden soll
   * @returns True, wenn die erste Umfrage angezeigt werden soll, sonst false
   */
  shouldShowFirstSurvey(): boolean;

  /**
   * Bestimmt den Typ der nächsten Umfrage
   * @returns Den Typ der nächsten anzuzeigenden Umfrage
   */
  getNextSurveyType(): SurveyType;

  /**
   * Markiert die aktuelle Umfrage als abgeschlossen
   * @param type Typ der abgeschlossenen Umfrage
   */
  markCurrentSurveyCompleted(type: SurveyType): void;

  /**
   * Setzt den Service zurück (für Tests)
   */
  reset(): void;
} 