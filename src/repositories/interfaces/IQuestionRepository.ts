import { LanguageCode } from "../../locales";
import { Question } from "../../types/question";

/**
 * Interface für die Verwaltung von Fragen-Entitäten
 */
export interface IQuestionRepository {
  /**
   * Holt Fragen für eine bestimmte Sprache
   * @param forceRefresh Flag, um den Cache zu umgehen und Daten neu zu laden
   * @param language Sprachcode für die Fragen
   * @returns Liste von Fragen
   */
  fetchQuestions(forceRefresh?: boolean, language?: LanguageCode): Promise<Question[]>;
  
  /**
   * Löscht den Fragen-Cache für eine oder alle Sprachen
   * @param language Optionaler Sprachcode; wenn nicht angegeben, wird für alle Sprachen gelöscht
   */
  clearCache(language?: LanguageCode): void;
} 