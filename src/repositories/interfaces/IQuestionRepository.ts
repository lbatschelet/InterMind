import { LanguageCode } from "../../locales";
import { Question } from "../../types/question";

/**
 * Interface für das Repository zum Abrufen von Fragen
 */
export interface IQuestionRepository {
  /**
   * Ruft alle verfügbaren Fragen ab.
   * 
   * @param includeDisabled Ob deaktivierte Fragen einbezogen werden sollen
   * @param language Die Sprache, in der die Fragen abgerufen werden sollen
   * @returns Eine Liste von Fragen
   */
  fetchQuestions(includeDisabled?: boolean, language?: LanguageCode): Promise<Question[]>;
  
  /**
   * Ruft eine einzelne Frage anhand ihrer ID ab.
   * 
   * @param questionId Die ID der abzurufenden Frage
   * @param language Die Sprache, in der die Frage abgerufen werden soll
   * @returns Die abgerufene Frage oder undefined, wenn keine gefunden wurde
   */
  getQuestionById(questionId: string, language?: LanguageCode): Promise<Question | undefined>;
} 