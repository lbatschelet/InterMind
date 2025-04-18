import { createLogger } from "~/src/utils/logger";
import { IDatabaseClient } from "../interfaces";
import { ILanguageRepository, Language } from "../interfaces/ILanguageRepository";
import { databaseClient } from "../database";

const log = createLogger("LanguageRepository");

/**
 * Repository für die Verwaltung von verfügbaren Sprachen
 */
export class LanguageRepository implements ILanguageRepository {
  /**
   * Erstellt eine neue Instanz des LanguageRepository
   * @param dbClient Datenbank-Client für DB-Zugriffe
   */
  constructor(private readonly dbClient: IDatabaseClient = databaseClient) {}

  /**
   * Lädt die verfügbaren Sprachen aus der Datenbank
   * @returns Liste der verfügbaren Sprachen
   */
  async getAvailableLanguages(): Promise<Language[]> {
    try {
      const { data, error } = await this.dbClient
        .from('languages')
        .select('code, name, native_name')
        .eq('is_active', true);
        
      if (error) {
        log.error("Error fetching languages", error);
        return this.getDefaultLanguages();
      }
      
      return data as Language[] || this.getDefaultLanguages();
    } catch (error) {
      log.error("Error in getAvailableLanguages", error);
      return this.getDefaultLanguages();
    }
  }
  
  /**
   * Liefert Standardsprachen im Falle eines Fehlers
   * @private
   */
  private getDefaultLanguages(): Language[] {
    return [
      { code: 'en', name: 'English', native_name: 'English' },
      { code: 'de', name: 'German', native_name: 'Deutsch' }
    ];
  }
}

// Singleton-Instanz für die gesamte Anwendung
export const languageRepository = new LanguageRepository(); 