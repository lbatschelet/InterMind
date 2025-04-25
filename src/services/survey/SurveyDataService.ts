import { createLogger } from "~/src/utils/logger";
import { DeviceService } from "../device";
import SurveyAnsweredQuestionsService from "./SurveyAnsweredQuestionsService";
import { slotService } from "../slot-scheduling";

const log = createLogger("SurveyDataService");

/**
 * Survey Data Management Service
 * -----------------------------
 * 
 * This service is responsible for:
 * 1. Managing survey data lifecycle
 * 2. Handling data deletion and reset operations
 */
class SurveyDataService {
  /**
   * Deletes all survey data associated with the current device.
   * 
   * This is a data management function that:
   * - Removes all survey responses
   * - Resets answered question tracking
   * - Allows users to start fresh
   * 
   * @returns Boolean indicating success or failure
   */
  static async deleteAllSurveys(): Promise<boolean> {
    log.info("Deleting all survey data and resetting question flags");
    return DeviceService.deleteDeviceData();
  }
  
  /**
   * Resets the "showOnce" question tracking, making previously
   * answered questions show up again in future surveys.
   * 
   * This is primarily for testing or administrative purposes.
   */
  static async resetAnsweredOnceQuestions(): Promise<void> {
    await SurveyAnsweredQuestionsService.resetAnsweredQuestions();
    log.info("Reset all showOnce question data");
  }
  
  /**
   * Resets the entire slot system.
   * Resets all survey scheduling, notifications, and slot-related data.
   */
  static async resetSlotSystem(): Promise<void> {
    await slotService.reset();
    log.info("Reset slot system");
  }
}

export default SurveyDataService; 