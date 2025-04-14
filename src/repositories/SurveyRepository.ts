import { createLogger } from "~/src/utils/logger";
import { supabase } from "../lib/supabase";

const log = createLogger("SurveyRepository");

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
   * @returns List of questions.
   */
  static async fetchQuestions() {
    log.info("Fetching survey questions");

    const { data, error } = await supabase.from("questions").select("*");

    if (error || !data) {
      log.error("Error fetching questions", error);
      throw new Error("Failed to fetch questions.");
    }

    // Debugging: Struktur der Daten ausgeben
    log.debug("Raw questions data from DB:", data);
    
    // Transformiere die Fragen in das erwartete Format
    const formattedQuestions = data.map(question => {
      let options;
      let autoAdvance;
      
      try {
        // Versuche, options zu parsen, falls es ein JSON-String ist
        const parsedOptions = typeof question.options === 'string' 
          ? JSON.parse(question.options) 
          : question.options;
          
        // Für Single-Choice Questions mit neuer Struktur
        if (question.type === 'single_choice' && parsedOptions && typeof parsedOptions === 'object' && 'options' in parsedOptions) {
          autoAdvance = parsedOptions.autoAdvance;
          options = parsedOptions.options;
        } else {
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
        text: question.text,
        options: options
      };
      
      // Spezielle Felder für bestimmte Fragetypen hinzufügen
      if (question.type === 'single_choice' && autoAdvance !== undefined) {
        return {
          ...baseQuestion,
          autoAdvance
        };
      }
      
      return baseQuestion;
    });
    
    log.debug("Formatted questions:", formattedQuestions);
    
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
