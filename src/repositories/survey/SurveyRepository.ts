import { createLogger } from "~/src/utils/logger";
import { LanguageCode } from "../../locales";
import { IDatabaseClient, IDatabaseQuery, ISurveyRepository } from "../interfaces";
import { databaseClient } from "../database";
import { AuthService } from "../../services/auth";
import { supabase } from "~/src/lib/supabase";

const log = createLogger("SurveyRepository");

/**
 * Repository für die Verwaltung von Umfrage-Entitäten in der Datenbank
 */
export class SurveyRepository implements ISurveyRepository {
  /**
   * Erstellt eine neue Instanz des SurveyRepository
   * @param dbClient Datenbank-Client für DB-Zugriffe
   */
  constructor(private readonly dbClient: IDatabaseClient = databaseClient) {}

  /**
   * Erstellt eine neue Umfrage
   * @param deviceId Die Geräte-ID, der die Umfrage zugeordnet wird
   * @param language Der Sprachcode für die Umfrage
   * @returns Die ID der neuen Umfrage
   */
  async createSurvey(deviceId: string, language: LanguageCode = 'en'): Promise<string> {
    log.info("Creating new survey for device", { deviceId, language });

    try {
      // We need to ensure we're authenticated before DB operations
      const userId = await AuthService.getCurrentUserId();
      if (!userId) {
        // Sign in anonymously if not already signed in
        await AuthService.signInAnonymously();
      }
      
      // Direct use of supabase instead of going through the abstraction to avoid TS issues
      const { data, error } = await supabase
        .from("surveys")
        .insert([{ 
          device_id: deviceId, // Use the actual device ID
          completed: false, 
          language
        }])
        .select("id")
        .single();

      if (error) {
        log.error("Error creating survey", { error, details: error.details, code: error.code, message: error.message });
        throw new Error(`Survey creation failed: ${error.message}`);
      }

      if (!data) {
        log.error("No data returned when creating survey");
        throw new Error("Survey creation failed: No data returned");
      }

      return data.id;
    } catch (error) {
      log.error("Error creating survey", { error, details: error instanceof Error ? error.message : "Unknown error" });
      throw error;
    }
  }

  /**
   * Markiert eine Umfrage als abgeschlossen
   * @param surveyId Die ID der abzuschließenden Umfrage
   */
  async completeSurvey(surveyId: string): Promise<void> {
    log.info("Marking survey as completed", { surveyId });

    // Direct use of supabase instead of going through the abstraction to avoid TS issues
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
   * Löscht alle Umfragen für ein bestimmtes Gerät
   * @param deviceId Die Geräte-ID, für die alle Umfragen gelöscht werden sollen
   * @returns True, wenn das Löschen erfolgreich war
   */
  async deleteAllSurveys(deviceId: string): Promise<boolean> {
    log.info("Deleting all surveys for device", { deviceId });

    try {
      // Direct use of supabase instead of going through the abstraction to avoid TS issues
      const { error } = await supabase
        .from("surveys")
        .delete()
        .eq("device_id", deviceId);

      if (error) {
        log.error("Error deleting surveys", error);
        return false;
      }

      return true;
    } catch (error) {
      log.error("Error deleting surveys", error);
      return false;
    }
  }

  /**
   * Prüft, ob ein Gerät abgeschlossene Umfragen hat
   * @param deviceId Die zu prüfende Geräte-ID
   * @returns True, wenn das Gerät mindestens eine abgeschlossene Umfrage hat
   */
  async hasCompletedSurveys(deviceId: string): Promise<boolean> {
    log.debug("Checking if device has completed surveys", { deviceId });

    try {
      // Direct use of supabase instead of going through the abstraction to avoid TS issues
      const { data, error } = await supabase
        .from("surveys")
        .select("id")
        .eq("device_id", deviceId)
        .eq("completed", true);

      if (error) {
        log.error("Error checking for completed surveys", error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      log.error("Error checking for completed surveys", error);
      return false;
    }
  }
}

// Singleton-Instanz für die gesamte Anwendung
export const surveyRepository = new SurveyRepository(); 