/**
 * @packageDocumentation
 * @module Services
 * 
 * @summary
 * Interface für den SurveyAnsweredQuestionsService
 */

/**
 * Interface für den SurveyAnsweredQuestionsService
 * Verantwortlich für die Verwaltung von Fragen, die bereits beantwortet wurden
 */
export interface ISurveyAnsweredQuestionsService {
  /**
   * Ruft die IDs der bereits beantworteten Fragen ab.
   * 
   * @returns Eine Liste der Frage-IDs, die bereits beantwortet wurden
   */
  getAnsweredOnceQuestions(): Promise<string[]>;
  
  /**
   * Markiert eine Frage als beantwortet.
   * 
   * @param questionId Die ID der zu markierenden Frage
   * @returns Ein Promise, das erfüllt wird, wenn die Frage markiert wurde
   */
  markQuestionAsAnswered(questionId: string): Promise<void>;
  
  /**
   * Prüft, ob eine Frage bereits beantwortet wurde.
   * 
   * @param questionId Die zu prüfende Frage-ID
   * @returns True, wenn die Frage bereits beantwortet wurde, sonst false
   */
  isQuestionAnswered(questionId: string): Promise<boolean>;
  
  /**
   * Setzt alle Informationen über beantwortete Fragen zurück.
   * 
   * @returns Ein Promise, das erfüllt wird, wenn alle Informationen zurückgesetzt wurden
   */
  resetAnsweredQuestions(): Promise<void>;
} 