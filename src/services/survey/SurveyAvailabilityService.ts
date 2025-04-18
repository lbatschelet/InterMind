import { createLogger } from "~/src/utils/logger";
import { slotCoordinator } from "../slots";

const log = createLogger("SurveyAvailabilityService");

// Export für Abwärtskompatibilität
export const SURVEY_AVAILABILITY_DURATION_MS = 60 * 60 * 1000;
export const MIN_HOURS_BETWEEN_SURVEYS = 3;

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
   * This delegates to the slot coordinator to determine if a survey
   * can be presented to the user at the current time.
   * 
   * @returns Promise resolving to boolean indicating survey availability
   */
  static async isSurveyAvailable(): Promise<boolean> {
    try {
      const available = await slotCoordinator.isSurveyAvailable();
      log.debug(`Survey availability check: ${available ? 'available' : 'not available'}`);
      return available;
    } catch (error) {
      log.error("Error checking survey availability", error);
      return false;
    }
  }
}

export default SurveyAvailabilityService; 