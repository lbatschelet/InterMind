/**
 * @packageDocumentation
 * @module Types
 * 
 * @summary
 * Typdefinitionen für das Umfragesystem
 */

/**
 * Verfügbare Umfragetypen im System
 */
export enum SurveyType {
  /**
   * Keine Umfrage verfügbar
   */
  NONE = 'none',

  /**
   * Die erste Umfrage, die beim ersten Start der App angezeigt wird
   */
  FIRST = 'first',

  /**
   * Reguläre Umfragen, die nach einem Zeitplan angezeigt werden
   */
  REGULAR = 'regular'
}

/**
 * Repräsentiert eine Frage in einer Umfrage
 */
export interface SurveyQuestion {
  /**
   * Eindeutige ID der Frage
   */
  id: string;

  /**
   * Text der Frage
   */
  text: string;

  /**
   * Typ der Frage (z.B. multiple-choice, text, likert)
   */
  type: 'multiple-choice' | 'text' | 'likert';

  /**
   * Verfügbare Antwortoptionen (für multiple-choice und likert)
   */
  options?: string[];

  /**
   * Ob die Frage beantwortet werden muss
   */
  required: boolean;
}

/**
 * Repräsentiert eine Umfrage
 */
export interface Survey {
  /**
   * Eindeutige ID der Umfrage
   */
  id: string;

  /**
   * Titel der Umfrage
   */
  title: string;

  /**
   * Beschreibung der Umfrage
   */
  description: string;

  /**
   * Typ der Umfrage
   */
  type: SurveyType;

  /**
   * Fragen in der Umfrage
   */
  questions: SurveyQuestion[];
}

/**
 * Repräsentiert eine Antwort auf eine Umfragefrage
 */
export interface SurveyResponse {
  /**
   * ID der Frage
   */
  questionId: string;

  /**
   * Antwort auf die Frage
   */
  answer: string | string[];
}

/**
 * Repräsentiert eine ausgefüllte Umfrage
 */
export interface CompletedSurvey {
  /**
   * ID der Umfrage
   */
  surveyId: string;

  /**
   * Zeitstempel, wann die Umfrage abgeschlossen wurde
   */
  completedAt: number;

  /**
   * Antworten auf die Umfragefragen
   */
  responses: SurveyResponse[];
} 