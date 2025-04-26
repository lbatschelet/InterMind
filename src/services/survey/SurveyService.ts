import { createLogger } from "~/src/utils/logger";
import { LanguageCode } from "../../locales";
import { Question } from "../../types/question";
import SurveySessionService from "./SurveySessionService";
import { SurveyLifecycleService } from "./SurveyLifecycleService";
import SurveyAvailabilityService from "./SurveyAvailabilityService";
import SurveyDataService from "./SurveyDataService";
import { FIRST_SURVEY_CHECKED_KEY } from "../../constants/storageKeys";

// Re-export für Abwärtskompatibilität
export { FIRST_SURVEY_CHECKED_KEY } from "../../constants/storageKeys";

const log = createLogger("SurveyService");

/**
 * Survey Management Facade Service
 * -------------------------------
 * 
 * This service acts as a facade for the specialized survey services:
 * - SurveySessionService: Managing survey sessions
 * - SurveyLifecycleService: Handling survey lifecycle events
 * - SurveyAvailabilityService: Checking survey availability
 * - SurveyDataService: Managing survey data
 * 
 * It maintains the original API for backward compatibility while
 * delegating to the specialized services.
 */
class SurveyService {
  /**
   * Prüft, ob eine Umfrage aktuell verfügbar ist
   */
  static async isSurveyAvailable(): Promise<boolean> {
    return await SurveyAvailabilityService.isSurveyAvailable();
  }

  /**
   * Starts a new survey session.
   * 
   * Delegates to SurveySessionService.
   * 
   * @param includeAnsweredOnceQuestions Whether to include questions marked as answered (for debugging/admin)
   * @param language The language code to use for retrieving localized questions
   * @returns Object containing survey ID and questions array
   * @throws Error if survey creation fails
   */
  static async startSurvey(includeAnsweredOnceQuestions = false, language: LanguageCode = 'en'): Promise<{ surveyId: string; questions: Question[] }> {
    return await SurveySessionService.startSurvey(includeAnsweredOnceQuestions, language);
  }

  /**
   * Marks a survey as completed and processes completion events.
   * 
   * Delegates to SurveySessionService and SurveyLifecycleService.
   * 
   * @param surveyId The unique identifier of the completed survey
   * @param answeredQuestions Array of Question objects that were answered
   */
  static async completeSurvey(surveyId: string, answeredQuestions?: Question[]): Promise<void> {
    log.info("Completing survey", { surveyId });
    
    // 1. Mark survey as completed in the repository via SessionService
    await SurveySessionService.completeSurvey(surveyId);
    
    // 2. Process completion events via LifecycleService
    await SurveyLifecycleService.processSurveyCompletion(answeredQuestions);
    
    log.info("Survey completed successfully");
  }

  /**
   * Deletes all survey data associated with the current device.
   * 
   * Delegates to SurveyDataService.
   * 
   * @returns Boolean indicating success or failure
   */
  static async deleteAllSurveys(): Promise<boolean> {
    return await SurveyDataService.deleteAllSurveys();
  }
  
  /**
   * Resets the "showOnce" question tracking, making previously
   * answered questions show up again in future surveys.
   * 
   * Delegates to SurveyDataService.
   */
  static async resetAnsweredOnceQuestions(): Promise<void> {
    await SurveyDataService.resetAnsweredOnceQuestions();
  }
  
  /**
   * Marks a survey as having expired without completion.
   * 
   * Delegates to SurveyLifecycleService.
   */
  static async handleSurveyExpired(): Promise<void> {
    await SurveyLifecycleService.handleSurveyExpired();
  }
  
  /**
   * Überprüft, ob die erste Umfrage bereits abgeschlossen wurde.
   * 
   * Delegates to SurveyLifecycleService.
   */
  static async isFirstSurveyCompleted(): Promise<boolean> {
    return await SurveyLifecycleService.isFirstSurveyCompleted();
  }
  
  /**
   * Markiert die erste Umfrage als abgeschlossen.
   * 
   * Delegates to SurveyLifecycleService.
   */
  static async markFirstSurveyAsCompleted(): Promise<void> {
    await SurveyLifecycleService.markFirstSurveyAsCompleted();
  }
}

export default SurveyService;
