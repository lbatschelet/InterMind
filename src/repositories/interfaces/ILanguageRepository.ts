/**
 * Repräsentiert eine Sprache mit Code und Namen
 */
export interface Language {
  code: string;
  name: string;
  native_name: string;
}

/**
 * Interface für die Verwaltung von Sprach-Entitäten
 */
export interface ILanguageRepository {
  /**
   * Holt verfügbare Sprachen
   * @returns Liste von Sprachen
   */
  getAvailableLanguages(): Promise<Language[]>;
} 