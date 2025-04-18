import { createLogger } from "~/src/utils/logger";
import { supabase } from "../lib/supabase";
import { LanguageCode } from "../locales";
import { Question } from "../types/question";

const log = createLogger("SurveyRepository");

// Cache für Fragen, um wiederholte DB-Abfragen zu vermeiden
const questionsCache: Record<LanguageCode, { data: Question[], timestamp: number }> = {
  en: { data: [], timestamp: 0 },
  de: { data: [], timestamp: 0 },
  fr: { data: [], timestamp: 0 }
};
const CACHE_TTL = 5 * 60 * 1000; // 5 Minuten Cache

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

export class SurveyRepository {
  /**
   * Creates a new survey.
   * @param deviceId The device ID associated with the survey.
   * @param language The language code for this survey
   * @returns The new survey ID.
   */
  static async createSurvey(deviceId: string, language: LanguageCode = 'en'): Promise<string> {
    log.info("Creating new survey for device", { deviceId, language });

    const { data, error } = await supabase
      .from("surveys")
      .insert([{ device_id: deviceId, completed: false, language }])
      .select("id")
      .single();

    if (error || !data) {
      log.error("Error creating survey", error);
      throw new Error("Survey creation failed");
    }

    return data.id;
  }

  /**
   * Fetches all questions for the specified language.
   * @param forceRefresh Optional flag to bypass cache and force a refresh
   * @param language The language code to use for the questions
   * @returns List of questions.
   */
  static async fetchQuestions(forceRefresh = false, language: LanguageCode = 'en'): Promise<Question[]> {
    // Verwende Cache, wenn er noch gültig ist und kein Refresh erzwungen wird
    const now = Date.now();
    const cache = questionsCache[language];
    
    if (!forceRefresh && cache.data.length > 0 && now - cache.timestamp < CACHE_TTL) {
      log.info("Using cached questions data", { 
        count: cache.data.length, 
        cacheAge: Math.round((now - cache.timestamp) / 1000) + 's',
        language
      });
      return cache.data;
    }

    log.info("Fetching survey questions from database", { language });
    
    try {
      // Join der Basistabelle mit Übersetzungstabelle für die spezifische Sprache
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
        throw new Error("Failed to fetch questions.");
      }

      if (!data || data.length === 0) {
        log.warn("No questions data returned from database");
        return [];
      }

      // Formatieren und Transformieren der Daten ins benötigte Format
      const formattedQuestions = (data as unknown as QuestionWithTranslation[]).map(item => {
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
                options = langOptions.options;
              } else if (baseOptions && 'options' in baseOptions) {
                options = baseOptions.options;
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
            return {
              ...baseQuestion,
              type: 'info_screen' as const,
              title: translation.title || '',
              text: translation.text || '',
              buttonText,
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
      const orderedQuestions = formattedQuestions.sort((a, b) => {
        const aSeq = a.sequence_number !== undefined ? a.sequence_number : 9999;
        const bSeq = b.sequence_number !== undefined ? b.sequence_number : 9999;
        return aSeq - bSeq;
      });
      
      // Aktualisiere Cache
      questionsCache[language] = {
        data: orderedQuestions,
        timestamp: now
      };
      
      log.debug("Questions data fetched and processed", { 
        count: orderedQuestions.length,
        language
      });
      
      return orderedQuestions;
    } catch (error) {
      log.error("Error in fetchQuestions", error);
      return [];
    }
  }

  /**
   * Lädt die verfügbaren Sprachen aus der Datenbank
   * @returns Liste der verfügbaren Sprachen
   */
  static async getAvailableLanguages(): Promise<{code: string, name: string, native_name: string}[]> {
    try {
      const { data, error } = await supabase
        .from('languages')
        .select('code, name, native_name')
        .eq('is_active', true);
        
      if (error) {
        log.error("Error fetching languages", error);
        return [
          { code: 'en', name: 'English', native_name: 'English' },
          { code: 'de', name: 'German', native_name: 'Deutsch' }
        ];
      }
      
      return data || [];
    } catch (error) {
      log.error("Error in getAvailableLanguages", error);
      return [
        { code: 'en', name: 'English', native_name: 'English' },
        { code: 'de', name: 'German', native_name: 'Deutsch' }
      ];
    }
  }

  /**
   * Marks a survey as completed.
   * @param surveyId The survey ID.
   */
  static async completeSurvey(surveyId: string): Promise<void> {
    log.info("Marking survey as completed", { surveyId });

    const { error } = await supabase
      .from("surveys")
      .update({ completed: true })
      .eq("id", surveyId);

    if (error) {
      log.error("Error completing survey", error);
      throw new Error("Survey completion failed");
    }
  }

  /**
   * Deletes all surveys for a specific device.
   * @param deviceId The device ID.
   * @returns True if deletion was successful.
   */
  static async deleteAllSurveys(deviceId: string): Promise<boolean> {
    log.info("Deleting all surveys for device", { deviceId });

    // Lösche alle Antworten für diese Device-ID (cascade delete)
    const { error } = await supabase
      .from("surveys")
      .delete()
      .eq("device_id", deviceId);

    if (error) {
      log.error("Error deleting surveys", error);
      return false;
    }

    return true;
  }

  /**
   * Checks if a device has any completed surveys.
   * @param deviceId The device ID to check
   * @returns True if the device has completed at least one survey, false otherwise
   */
  static async hasCompletedSurveys(deviceId: string): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from("surveys")
        .select("id", { count: "exact", head: true })
        .eq("device_id", deviceId)
        .eq("completed", true);
      
      if (error) {
        log.error("Error checking completed surveys", error);
        throw new Error("Failed to check completed surveys");
      }
      
      return count !== null && count > 0;
    } catch (error) {
      log.error("Error in hasCompletedSurveys", error);
      return false;
    }
  }
}
