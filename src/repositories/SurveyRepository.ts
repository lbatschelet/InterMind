import { createLogger } from "~/src/utils/logger";
import { supabase } from "../lib/supabase";

const log = createLogger("SurveyRepository");

// Typ für Fragen aus der Datenbank definieren
type RawQuestionData = {
  id: string;
  type: string;
  title?: string;
  text: string;
  options: unknown;
  category?: string;
  sequence_number?: number;
};

// Cache für Fragen, um wiederholte DB-Abfragen zu vermeiden
let questionsCache: RawQuestionData[] = [];
let lastQuestionsFetch = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 Minuten Cache

export class SurveyRepository {
  /**
   * Creates a new survey.
   * @param deviceId The device ID associated with the survey.
   * @returns The new survey ID.
   */
  static async createSurvey(deviceId: string): Promise<string> {
    log.info("Creating new survey for device", { deviceId });

    const { data, error } = await supabase
      .from("surveys")
      .insert([{ device_id: deviceId, completed: false }])
      .select("id")
      .single();

    if (error || !data) {
      log.error("Error creating survey", error);
      throw new Error("Survey creation failed");
    }

    return data.id;
  }

  /**
   * Fetches all questions.
   * @param forceRefresh Optional flag to bypass cache and force a refresh
   * @returns List of questions.
   */
  static async fetchQuestions(forceRefresh = false) {
    // Verwende Cache, wenn er noch gültig ist und kein Refresh erzwungen wird
    const now = Date.now();
    if (!forceRefresh && questionsCache.length > 0 && now - lastQuestionsFetch < CACHE_TTL) {
      log.info("Using cached questions data", { 
        count: questionsCache.length, 
        cacheAge: Math.round((now - lastQuestionsFetch) / 1000) + 's' 
      });
      return this.formatQuestions(questionsCache);
    }

    log.info("Fetching survey questions from database");

    const { data, error } = await supabase.from("questions").select("*");

    if (error || !data) {
      log.error("Error fetching questions", error);
      throw new Error("Failed to fetch questions.");
    }

    // Aktualisiere Cache
    questionsCache = data as RawQuestionData[];
    lastQuestionsFetch = now;
    
    log.debug("Questions data fetched from DB:", { count: data.length });
    
    return this.formatQuestions(data as RawQuestionData[]);
  }

  /**
   * Formatiert die Rohfragen-Daten in das erwartete Format.
   * Extrahiert als separate Funktion, um Code-Duplizierung zu vermeiden.
   * 
   * @param questionsData Die Rohdaten von der Datenbank oder dem Cache
   * @returns Formatierte Fragen-Objekte
   */
  private static formatQuestions(questionsData: RawQuestionData[]) {
    const formattedQuestions = questionsData.map(question => {
      let options;
      let autoAdvance;
      let showOnce = false; // Standard: Die Frage wird nicht nur einmal angezeigt
      let buttonText; // Für Info-Screens
      
      // Debug für info_screen-Typen
      if (question.type === 'info_screen') {
        log.debug("Original Info Screen Question:", {
          id: question.id,
          type: question.type,
          title: question.title,
          textLength: question.text?.length || 0,
          text: question.text?.substring(0, 50) + '...',
          options: question.options
        });
      }
      
      try {
        // Versuche, options zu parsen, falls es ein JSON-String ist
        const parsedOptions = typeof question.options === 'string' 
          ? JSON.parse(question.options) 
          : question.options;
          
        // Für Single-Choice Questions mit neuer Struktur
        if (question.type === 'single_choice' && parsedOptions && typeof parsedOptions === 'object' && 'options' in parsedOptions) {
          autoAdvance = parsedOptions.autoAdvance;
          // showOnce-Flag extrahieren, wenn vorhanden
          if ('showOnce' in parsedOptions) {
            showOnce = !!parsedOptions.showOnce;
          }
          options = parsedOptions.options;
        } 
        // Für Info-Screen mit buttonText und showOnce im options-Objekt
        else if (question.type === 'info_screen' && parsedOptions && typeof parsedOptions === 'object') {
          // Extract showOnce flag if exists
          if ('showOnce' in parsedOptions) {
            showOnce = !!parsedOptions.showOnce;
          }
          
          // Extract buttonText if exists
          if ('buttonText' in parsedOptions) {
            buttonText = parsedOptions.buttonText;
          }
          
          // Debug für Info-Screen Optionen
          log.debug("Parsed Info Screen Options:", parsedOptions);
        }
        else {
          options = parsedOptions;
        }
      } catch (e) {
        log.error("Error parsing options for question", { id: question.id, error: e });
        options = question.options; // Behalte original, wenn das Parsen fehlschlägt
      }
      
      // Basisdaten für alle Fragetypen
      const baseQuestion = {
        id: question.id,
        type: question.type,
        title: question.title, // Für Info-Screens relevant
        text: question.text,
        category: question.category, // Kategorie aus Datenbank übernehmen
        sequence_number: question.sequence_number, // Sequenznummer für Sortierung
        showOnce: showOnce // showOnce-Flag setzen
      };
      
      // Spezielle Felder je nach Fragetyp hinzufügen
      if (question.type === 'info_screen') {
        // Extra Debug für Info-Screen-Texte
        log.debug("Formatted Info Screen Text (first 100 chars):", 
          baseQuestion.text?.substring(0, 100).replace(/\n/g, "\\n"));
        
        // Füge buttonText für InfoScreen-Fragen hinzu
        return {
          ...baseQuestion,
          buttonText: buttonText || "Continue" // Standardwert, falls nicht gesetzt
        };
      } else if (question.type === 'single_choice' && autoAdvance !== undefined) {
        return {
          ...baseQuestion,
          options, // Füge die Optionen hinzu
          autoAdvance
        };
      } else {
        // Für alle anderen Fragetypen
        return {
          ...baseQuestion,
          options // Füge die Optionen hinzu
        };
      }
    });
    
    log.debug("Questions formatted", { count: formattedQuestions.length });
    
    return formattedQuestions;
  }

  /**
   * Marks a survey as completed.
   * @param surveyId The survey ID.
   */
  static async completeSurvey(surveyId: string): Promise<void> {
    log.info("Completing survey", { surveyId });

    const { error } = await supabase
      .from("surveys")
      .update({ completed: true })
      .eq("id", surveyId);

    if (error) {
      log.error("Failed to complete survey", error);
      throw new Error("Could not complete survey.");
    }

    log.info("Survey successfully completed", { surveyId });
  }

  /**
   * Deletes all surveys for a given device.
   * @param deviceId The device ID.
   * @returns True if successful, false otherwise.
   */
  static async deleteAllSurveys(deviceId: string): Promise<boolean> {
    try {
      log.info("Deleting surveys for device:", deviceId);

      const { error } = await supabase
        .from("surveys")
        .delete()
        .eq("device_id", deviceId);

      if (error) {
        log.error("Error deleting surveys:", error);
        return false;
      }

      log.info("Surveys successfully deleted.");
      return true;
    } catch (error) {
      log.error("Unexpected error:", error);
      return false;
    }
  }
}
