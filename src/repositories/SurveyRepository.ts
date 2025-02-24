import { supabase } from "../lib/supabase";
import { createLogger } from "~/src/utils/logger";

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

    return data;
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
