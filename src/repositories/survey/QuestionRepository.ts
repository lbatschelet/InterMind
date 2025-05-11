import { createLogger } from "~/src/utils/logger";
import { LanguageCode } from "../../locales";
import { Question } from "../../types/question";
import { IDatabaseClient, IQuestionRepository } from "../interfaces";
import { databaseClient } from "../database";
import { supabase } from "~/src/lib/supabase";
import { AuthService } from "../../services/auth";

const log = createLogger("QuestionRepository");

// Typdefinitionen für die Datenbank-Ergebnisse
interface BaseQuestion {
  id: string;
  type: string;
  category?: string;
  sequence_number?: number;
  image_source?: string;
  options_structure?: any;
}

interface Translation {
  id: string;
  question_id: string;
  language: string;
  title?: string;
  text: string;
  options_content?: any;
}

type QuestionWithTranslation = BaseQuestion & {
  translations: Translation[];
};

/**
 * Cache für Fragen, um wiederholte DB-Abfragen zu vermeiden
 */
class QuestionCache {
  private cache: Record<LanguageCode, { data: Question[], timestamp: number }>;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 Minuten Cache
  
  constructor() {
    this.cache = {
      en: { data: [], timestamp: 0 },
      de: { data: [], timestamp: 0 },
      fr: { data: [], timestamp: 0 }
    };
  }
  
  /**
   * Prüft, ob der Cache gültige Daten für die angegebene Sprache enthält
   */
  isValid(language: LanguageCode): boolean {
    const now = Date.now();
    const cached = this.cache[language];
    return cached.data.length > 0 && now - cached.timestamp < this.CACHE_TTL;
  }
  
  /**
   * Ruft gecachte Fragen für die angegebene Sprache ab
   */
  get(language: LanguageCode): Question[] {
    return this.cache[language].data;
  }
  
  /**
   * Speichert Fragen im Cache für die angegebene Sprache
   */
  set(language: LanguageCode, data: Question[]): void {
    this.cache[language] = {
      data,
      timestamp: Date.now()
    };
  }
  
  /**
   * Löscht den Cache für eine oder alle Sprachen
   */
  clear(language?: LanguageCode): void {
    if (language) {
      this.cache[language] = { data: [], timestamp: 0 };
    } else {
      Object.keys(this.cache).forEach(lang => {
        this.cache[lang as LanguageCode] = { data: [], timestamp: 0 };
      });
    }
  }
}

/**
 * Repository für die Verwaltung von Fragen
 */
export class QuestionRepository implements IQuestionRepository {
  private questionCache: QuestionCache;
  
  /**
   * Erstellt eine neue Instanz des QuestionRepository
   * @param dbClient Datenbank-Client für DB-Zugriffe
   */
  constructor(private readonly dbClient: IDatabaseClient = databaseClient) {
    this.questionCache = new QuestionCache();
  }
  
  /**
   * Löscht den Fragen-Cache für eine oder alle Sprachen
   * @param language Optionaler Sprachcode; wenn nicht angegeben, wird für alle Sprachen gelöscht
   */
  clearCache(language?: LanguageCode): void {
    this.questionCache.clear(language);
    log.info("Question cache cleared", { language: language || 'all' });
  }

  /**
   * Ruft alle Fragen für die angegebene Sprache ab
   * @param forceRefresh Optional flag to bypass cache and force a refresh
   * @param language Die Sprache für Fragetexte
   * @returns Liste von Fragen
   */
  async fetchQuestions(forceRefresh = false, language: LanguageCode = 'en'): Promise<Question[]> {
    // Verwende Cache, wenn er noch gültig ist und kein Refresh erzwungen wird
    if (!forceRefresh && this.questionCache.isValid(language)) {
      const cachedData = this.questionCache.get(language);
      log.info("Using cached questions data", { 
        count: cachedData.length, 
        language
      });
      return cachedData;
    }

    log.info("Fetching survey questions from database", { language });
    
    try {
      // Ensure we are authenticated
      const isAuthenticated = await AuthService.isAuthenticated();
      
      if (!isAuthenticated) {
        log.info("Not authenticated, signing in anonymously");
        await AuthService.signInAnonymously();
      }
      
      // Now use the supabase client
      const { data, error } = await supabase
        .from('questions')
        .select(`
          id,
          type,
          category,
          sequence_number,
          image_source,
          options_structure,
          translations!inner(id, language, title, text, options_content)
        `)
        .eq('translations.language', language);

      if (error) {
        log.error("Error fetching questions", error);
        throw new Error("Failed to fetch questions: " + error.message);
      }

      if (!data || data.length === 0) {
        log.warn("No questions data returned from database");
        return [];
      }

      // Formatieren und Transformieren der Daten ins benötigte Format
      const formattedQuestions = this.transformQuestionsData(data as unknown as QuestionWithTranslation[], language);
      
      // Speichern im Cache
      this.questionCache.set(language, formattedQuestions);
      
      log.debug("Questions data fetched and processed", { 
        count: formattedQuestions.length,
        language
      });
      
      return formattedQuestions;
    } catch (error) {
      log.error("Error in fetchQuestions", error);
      return [];
    }
  }
  
  /**
   * Transformiert die Rohdaten aus der Datenbank in das Question-Format
   * @private
   */
  private transformQuestionsData(data: QuestionWithTranslation[], language: LanguageCode): Question[] {
    const formattedQuestions = data.map(item => {
      // Finde die Übersetzung für die aktuelle Sprache
      const translation = item.translations.find(t => t.language === language) || 
                        { title: '', text: '', options_content: null };
      
      // Basisdaten
      const baseQuestion = {
        id: item.id,
        type: item.type,
        category: item.category,
        sequence_number: item.sequence_number,
        imageSource: item.image_source
      };
      
      // Optionen verarbeiten
      let options = null;
      let showOnce = false;
      let buttonText;
      let autoAdvance = false;
      
      try {
        // Versuche, die options_structure zu parsen
        const baseOptions = typeof item.options_structure === 'string' 
          ? JSON.parse(item.options_structure) 
          : item.options_structure;
          
        // Versuche, die language-spezifischen options_content zu parsen
        const langOptions = translation.options_content 
          ? (typeof translation.options_content === 'string' 
              ? JSON.parse(translation.options_content) 
              : translation.options_content)
          : null;
        
        // Extrahiere flags und einstellungen aus baseOptions
        if (baseOptions) {
          if ('showOnce' in baseOptions) {
            showOnce = !!baseOptions.showOnce;
        }
          if ('autoAdvance' in baseOptions) {
            autoAdvance = !!baseOptions.autoAdvance;
          }
        }
        
        // Verarbeite Optionen je nach Fragetyp
        switch (item.type) {
          case 'single_choice':
          case 'multiple_choice':
            if (langOptions && 'options' in langOptions) {
              options = langOptions.options.map((opt: any) => {
                // Basisdaten der Option
                const processedOption = {
                  value: opt.value,
                  label: opt.label
                };
                
                // Füge hideQuestions hinzu, falls vorhanden
                if (opt.hideQuestions && Array.isArray(opt.hideQuestions)) {
                  return {
                    ...processedOption,
                    hideQuestions: opt.hideQuestions
                  };
                }
                
                return processedOption;
              });
            } else if (baseOptions && 'options' in baseOptions) {
              options = baseOptions.options.map((opt: any) => {
                // Basisdaten der Option
                const processedOption = {
                  value: opt.value,
                  label: opt.label
                };
                
                // Füge hideQuestions hinzu, falls vorhanden
                if (opt.hideQuestions && Array.isArray(opt.hideQuestions)) {
                  return {
                    ...processedOption,
                    hideQuestions: opt.hideQuestions
                  };
                }
                
                return processedOption;
              });
            }
            break;
            
          case 'slider':
            if (langOptions && 'values' in langOptions) {
              options = { values: langOptions.values };
            } else if (baseOptions && 'values' in baseOptions) {
              options = { values: baseOptions.values };
          }
            break;
            
          case 'info_screen':
            if (langOptions && 'buttonText' in langOptions) {
              buttonText = langOptions.buttonText;
            } else if (baseOptions && 'buttonText' in baseOptions) {
              buttonText = baseOptions.buttonText;
            }
            // Debug-Ausgabe für das buttonText-Feld
            if (item.id === 'consent_screen') {
              log.debug('Extracted buttonText for consent_screen', { 
                buttonText,
                langOptions,
                baseOptions
              });
            }
            break;
        }
      } catch (e) {
        log.error("Error parsing options for question", { id: item.id, error: e });
      }
      
      // Je nach Fragetyp das entsprechende Objekt erstellen
      switch (item.type) {
        case 'single_choice':
          return {
            ...baseQuestion,
            type: 'single_choice' as const,
            text: translation.text || '',
            options: options || [],
            autoAdvance,
            showOnce
          };
        
        case 'multiple_choice':
          return {
            ...baseQuestion,
            type: 'multiple_choice' as const,
            text: translation.text || '',
            options: options || [],
            showOnce
          };
          
        case 'slider':
          return {
            ...baseQuestion,
            type: 'slider' as const,
            text: translation.text || '',
            options: options || { values: [] },
            showOnce
          };
          
        case 'text':
          return {
            ...baseQuestion,
            type: 'text' as const,
            text: translation.text || '',
            options: null,
            showOnce
          };
          
        case 'info_screen':
          // Versuche, die options_structure zu parsen
          const baseOptions = typeof item.options_structure === 'string' 
            ? JSON.parse(item.options_structure) 
            : item.options_structure;
            
          return {
            ...baseQuestion,
            type: 'info_screen' as const,
            title: translation.title || '',
            text: translation.text || '',
            buttonText: buttonText || 'general.continue', // Explizites Setzen mit Fallback
            options: baseOptions ? { 
              action: baseOptions.action // Explizit die action-Property übernehmen
            } : undefined,
            showOnce
          };
          
        default:
          // Fallback für unbekannte Typen
          log.warn("Unknown question type encountered", { type: item.type, id: item.id });
          return {
            ...baseQuestion,
            type: 'info_screen' as const,
            title: translation.title || '',
            text: translation.text || '',
            showOnce
          };
      }
    });
    
    // Sortieren nach sequence_number
    return formattedQuestions.sort((a, b) => {
      const aSeq = a.sequence_number !== undefined ? a.sequence_number : 9999;
      const bSeq = b.sequence_number !== undefined ? b.sequence_number : 9999;
      return aSeq - bSeq;
    });
  }

  /**
   * Holt eine einzelne Frage anhand ihrer ID
   * @param questionId Die ID der abzurufenden Frage
   * @param language Die Sprache für Fragetexte
   * @returns Die abgerufene Frage oder undefined, wenn keine gefunden wurde
   */
  async getQuestionById(questionId: string, language: LanguageCode = 'en'): Promise<Question | undefined> {
    try {
      // Zuerst versuchen, die Frage aus dem Cache zu holen
      if (this.questionCache.isValid(language)) {
        const cachedQuestions = this.questionCache.get(language);
        const cachedQuestion = cachedQuestions.find(q => q.id === questionId);
        
        if (cachedQuestion) {
          log.debug("Found question in cache", { questionId, language });
          return cachedQuestion;
        }
      }
      
      log.info("Fetching single question from database", { questionId, language });
      
      // Stelle sicher, dass wir authentifiziert sind
      const isAuthenticated = await AuthService.isAuthenticated();
      
      if (!isAuthenticated) {
        log.info("Not authenticated, signing in anonymously");
        await AuthService.signInAnonymously();
      }
      
      // Abfrage der Datenbank
      const { data, error } = await supabase
        .from('questions')
        .select(`
          id,
          type,
          category,
          sequence_number,
          image_source,
          options_structure,
          translations!inner(id, language, title, text, options_content)
        `)
        .eq('id', questionId)
        .eq('translations.language', language);

      if (error) {
        log.error("Error fetching question", error);
        throw new Error("Failed to fetch question: " + error.message);
      }

      if (!data || data.length === 0) {
        log.warn("No question found with ID", { questionId });
        return undefined;
      }

      // Formatieren und Transformieren der Daten ins benötigte Format
      const formattedQuestions = this.transformQuestionsData(data as unknown as QuestionWithTranslation[], language);
      
      return formattedQuestions[0];
    } catch (error) {
      log.error("Error in getQuestionById", error);
      return undefined;
    }
  }
}

// Singleton-Instanz für die gesamte Anwendung
export const questionRepository = new QuestionRepository(); 