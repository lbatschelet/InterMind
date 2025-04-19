import { createLogger } from "~/src/utils/logger";
import LocationService from "../location/LocationService";
import { supabase } from "~/src/lib/supabase";

const log = createLogger("SurveyLocationService");

/**
 * Survey Location Management Service
 * ---------------------------------
 * 
 * This service is responsible for:
 * 1. Getting the user's location during a survey
 * 2. Updating the survey record with location data
 */
class SurveyLocationService {
  /**
   * Records location data for a survey if permissions are granted and question
   * sequence number is >= 100
   * 
   * @param surveyId ID of the current survey
   * @param questionSequenceNumber The sequence number of the current question
   * @returns Boolean indicating if location was successfully captured
   */
  static async captureLocationIfEligible(
    surveyId: string,
    questionSequenceNumber: number
  ): Promise<boolean> {
    try {
      // Only capture location when questionSequenceNumber >= 100
      if (!surveyId || questionSequenceNumber < 100) {
        log.debug("Skipping location capture", { 
          surveyId, 
          questionSequenceNumber,
          reason: questionSequenceNumber < 100 ? "sequence number too low" : "missing survey ID"
        });
        return false;
      }

      // Check if location is already captured for this survey
      const { data: surveyData } = await supabase
        .from('surveys')
        .select('location_lat, location_lng')
        .eq('id', surveyId)
        .single();

      // If location is already captured, don't capture again
      if (surveyData?.location_lat && surveyData?.location_lng) {
        log.debug("Location already captured for survey", { surveyId });
        return true;
      }

      // Get the current location
      const location = await LocationService.getLocation();
      
      // Skip if location couldn't be obtained (default values are 0,0)
      if (location.lat === 0 && location.lng === 0) {
        log.warn("Could not get valid location, skipping update", { surveyId });
        return false;
      }

      // Update the survey with location data
      const { error } = await supabase
        .from('surveys')
        .update({
          location_lat: location.lat,
          location_lng: location.lng
        })
        .eq('id', surveyId);

      if (error) {
        log.error("Error updating survey with location", { surveyId, error });
        return false;
      }

      log.info("Successfully captured location for survey", { 
        surveyId, 
        location: { lat: location.lat, lng: location.lng } 
      });
      
      return true;
    } catch (error) {
      log.error("Failed to capture location for survey", { surveyId, error });
      return false;
    }
  }
}

export default SurveyLocationService; 