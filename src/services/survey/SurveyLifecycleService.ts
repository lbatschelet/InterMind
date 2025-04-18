import { createLogger } from "~/src/utils/logger";
import { Question } from "../../types/question";
import SurveyAnsweredQuestionsService from "./SurveyAnsweredQuestionsService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { slotCoordinator, SurveyEvent } from "../slots";

const log = createLogger("SurveyLifecycleService");

// Key für die Speicherung, ob die erste Umfrage bereits überprüft wurde
export const FIRST_SURVEY_CHECKED_KEY = 'first_survey_checked';

/**
 * Survey Lifecycle Management Service
 * ----------------------------------
 * 
 * This service is responsible for:
 * 1. Managing the survey lifecycle events
 * 2. Handling the first survey special case
 * 3. Tracking and coordinating with the slot system
 */
class SurveyLifecycleService {
  /**
   * Processes a completed survey and triggers relevant events.
   * 
   * This method:
   * 1. Processes answered questions to update "showOnce" status
   * 2. Determines if this was the first completed survey
   * 3. Notifies the SlotCoordinator of the appropriate event
   * 
   * @param answeredQuestions Array of Question objects that were answered
   */
  static async processSurveyCompletion(answeredQuestions?: Question[]): Promise<void> {
    log.info("Processing survey completion");
    
    // Process answered "showOnce" questions
    if (answeredQuestions && answeredQuestions.length > 0) {
      const showOnceQuestions = answeredQuestions.filter(q => 'showOnce' in q && q.showOnce);
      
      for (const question of showOnceQuestions) {
        await SurveyAnsweredQuestionsService.markQuestionAsAnswered(question.id);
      }
      
      log.debug("Marked showOnce questions as answered", { 
        count: showOnceQuestions.length
      });
    }

    // Check if this is the first completed survey
    const firstSurveyCompleted = await this.isFirstSurveyCompleted();
    
    // Notify SlotCoordinator of the appropriate event
    if (!firstSurveyCompleted) {
      // It's the first survey
      await this.markFirstSurveyAsCompleted();
      await slotCoordinator.onSurveyEvent(SurveyEvent.FIRST_SURVEY_COMPLETED);
      log.info("First survey completion processed");
    } else {
      // Regular survey
      await slotCoordinator.onSurveyEvent(SurveyEvent.SURVEY_COMPLETED);
      log.info("Regular survey completion processed");
    }
  }

  /**
   * Handles a survey expiration event.
   */
  static async handleSurveyExpired(): Promise<void> {
    log.info("Handling expired survey");
    await slotCoordinator.onSurveyEvent(SurveyEvent.SURVEY_EXPIRED);
  }
  
  /**
   * Checks if the first survey has already been completed.
   */
  static async isFirstSurveyCompleted(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(FIRST_SURVEY_CHECKED_KEY);
      return value === 'true';
    } catch (error) {
      log.error("Error checking if first survey was completed", error);
      return false;
    }
  }
  
  /**
   * Marks the first survey as completed.
   */
  static async markFirstSurveyAsCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(FIRST_SURVEY_CHECKED_KEY, 'true');
      log.info("First survey marked as completed");
    } catch (error) {
      log.error("Error marking first survey as completed", error);
    }
  }
}

export default SurveyLifecycleService; 