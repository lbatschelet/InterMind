/**
 * @packageDocumentation
 * @module Services/Reset
 * 
 * @summary
 * Service zum Zurücksetzen von Anwendungsdaten.
 * Dient zur Vermeidung zyklischer Abhängigkeiten zwischen Services.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createLogger } from "~/src/utils/logger";
import { supabase } from "../../lib/supabase";
import { slotService } from "../slot-scheduling";
import { DEVICE_ID_KEY, FIRST_SURVEY_CHECKED_KEY } from "../../constants/storageKeys";

// Konstante für den Speicherschlüssel der beantworteten Fragen
const ANSWERED_QUESTIONS_STORAGE_KEY = "answered_once_questions";

const log = createLogger("DataResetService");

/**
 * Service zum Zurücksetzen aller Anwendungsdaten
 * Vermeidet zyklische Abhängigkeiten zwischen Services
 */
class DataResetService {
  /**
   * Setzt alle gespeicherten Antworten zurück
   */
  static async resetAnsweredQuestions(): Promise<void> {
    try {
      if (!ANSWERED_QUESTIONS_STORAGE_KEY) {
        log.error("ANSWERED_QUESTIONS_STORAGE_KEY is not defined");
        return;
      }
      
      await AsyncStorage.removeItem(ANSWERED_QUESTIONS_STORAGE_KEY);
      log.info("Reset all answered questions");
    } catch (error) {
      log.error("Failed to reset answered questions", error);
    }
  }

  /**
   * Löscht alle Gerätedaten aus der Datenbank und setzt den lokalen Speicher zurück
   * Dies setzt auch alle beantworteten Fragen zurück, sodass sie erneut angezeigt werden
   * 
   * @param deviceId Die ID des Geräts, dessen Daten gelöscht werden sollen
   * @param generateNewDeviceIdCallback Callback-Funktion, die eine neue Geräte-ID generiert und speichert
   * @returns True, wenn das Löschen erfolgreich war, sonst false
   */
  static async deleteAllUserData(
    deviceId: string, 
    generateNewDeviceIdCallback: () => Promise<string>
  ): Promise<boolean> {
    try {
      log.info(`Deleting all data for device: ${deviceId}`);

      // Lösche alle Gerätedaten aus der Datenbank
      const { error } = await supabase
        .from("surveys")
        .delete()
        .eq("device_id", deviceId);

      if (error) {
        log.error("Error deleting device data from database", error);
        return false;
      }

      // Setze beantwortete Fragen in AsyncStorage zurück
      await this.resetAnsweredQuestions();
      log.info("Reset answered questions after data deletion");

      // Setze das "erste Umfrage abgeschlossen"-Flag in AsyncStorage zurück
      if (FIRST_SURVEY_CHECKED_KEY) {
        await AsyncStorage.setItem(FIRST_SURVEY_CHECKED_KEY, "false");
        log.info("Reset first survey completion status");
      }

      // Setze das Slot-System zurück (kümmert sich um das Abbrechen von Benachrichtigungen und den Slot-Speicher)
      await slotService.reset();
      log.info("Slot system reset completed after data deletion");
      
      // Generiere eine neue Geräte-ID über den bereitgestellten Callback
      const newDeviceId = await generateNewDeviceIdCallback();
      log.info(`Generated new device ID after data deletion: ${newDeviceId}`);

      return true;
    } catch (error) {
      log.error("Failed to delete device data", error);
      return false;
    }
  }
}

export default DataResetService; 