import { createLogger } from "~/src/utils/logger";
import { slotService } from "../slot-scheduling";
import { FIRST_SURVEY_CHECKED_KEY } from "../../constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";

const log = createLogger("SurveyAvailabilityService");

/**
 * Survey Availability Service
 * --------------------------
 * 
 * This service is responsible for:
 * 1. Checking if a survey is currently available
 * 2. Managing time-based availability constraints
 * 3. Delegating to the slot system
 */
class SurveyAvailabilityService {
  /**
   * Checks if a survey is currently available.
   * 
   * Die erste Umfrage ist immer verfügbar.
   * Spätere Umfragen werden durch das Slot-System gesteuert.
   * 
   * @returns Promise resolving to boolean indicating survey availability
   */
  static async isSurveyAvailable(): Promise<boolean> {
    try {
      // Prüfen, ob die erste Umfrage bereits abgeschlossen wurde
      const firstSurveyCompleted = await this.isFirstSurveyCompleted();
      
      // Wenn die erste Umfrage noch nicht abgeschlossen wurde, ist eine Umfrage immer verfügbar
      if (!firstSurveyCompleted) {
        log.debug('First survey not yet completed - survey is available');
        return true;
      }
      
      // Bei allen weiteren Umfragen die Verfügbarkeit über das Slot-System prüfen
      const available = await slotService.isCurrentlyAvailable();
      log.debug(`Regular survey availability check: ${available ? 'available' : 'not available'}`);
      return available;
    } catch (error) {
      log.error("Error checking survey availability", error);
      return false;
    }
  }
  
  /**
   * Prüft, ob die erste Umfrage bereits abgeschlossen wurde.
   * 
   * @returns Promise mit boolean (true, wenn erste Umfrage bereits abgeschlossen wurde)
   */
  private static async isFirstSurveyCompleted(): Promise<boolean> {
    try {
      if (!FIRST_SURVEY_CHECKED_KEY) {
        log.error("FIRST_SURVEY_CHECKED_KEY is not defined");
        return false;
      }
      
      const value = await AsyncStorage.getItem(FIRST_SURVEY_CHECKED_KEY);
      return value === 'true';
    } catch (error) {
      log.error("Error checking if first survey was completed", error);
      return false;
    }
  }
}

export default SurveyAvailabilityService; 