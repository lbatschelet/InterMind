import { createLogger } from "~/src/utils/logger";
import { LanguageCode } from "../locales";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { Question } from "../types/question";
import AnsweredQuestionsService from "./AnsweredQuestionsService";
import { DeviceService } from "./DeviceService";
import { slotCoordinator, SurveyEvent } from "./slots";
import AsyncStorage from "@react-native-async-storage/async-storage";

const log = createLogger("SurveyService");

// Key für die Speicherung, ob die erste Umfrage bereits überprüft wurde
export const FIRST_SURVEY_CHECKED_KEY = 'first_survey_checked';

// Export für Abwärtskompatibilität
export const SURVEY_AVAILABILITY_DURATION_MS = 60 * 60 * 1000;
export const MIN_HOURS_BETWEEN_SURVEYS = 3;

/**
 * Survey Management Service
 * ------------------------
 * 
 * This service is responsible for:
 * 1. Creating and managing survey sessions
 * 2. Fetching and processing survey questions
 * 3. Recording survey completion
 * 4. Managing answered questions tracking
 * 
 * It delegates scheduling and availability to the SlotCoordinator.
 */
class SurveyService {
  /**
   * Prüft, ob eine Umfrage aktuell verfügbar ist
   */
  static async isSurveyAvailable(): Promise<boolean> {
    return await slotCoordinator.isSurveyAvailable();
  }

  /**
   * Starts a new survey session.
   * 
   * This method:
   * 1. Creates a new survey session with device ID
   * 2. Retrieves and processes questions (filtering, ordering)
   * 3. Returns data needed to present the survey to the user
   * 
   * Note: It's the caller's responsibility to verify survey availability
   * before calling this method.
   * 
   * Filtering logic:
   * - Removes questions marked as "showOnce" that have been previously answered
   * - This prevents users from seeing the same one-time questions repeatedly
   * 
   * @param includeAnsweredOnceQuestions Whether to include questions marked as answered (for debugging/admin)
   * @param language The language code to use for retrieving localized questions
   * @returns Object containing survey ID and questions array
   * @throws Error if survey creation fails
   */
  static async startSurvey(includeAnsweredOnceQuestions = false, language: LanguageCode = 'en'): Promise<{ surveyId: string; questions: Question[] }> {
    log.info("Starting a new survey session...", { language });

    try {
      // Parallelisiere die DeviceID-Abfrage und Fragenabruf, um Zeit zu sparen
      const [deviceId, allQuestions] = await Promise.all([
        DeviceService.getDeviceId(),
        SurveyRepository.fetchQuestions(false, language)
      ]);

      // Survey erstellen mit der jetzt bekannten Device-ID und Sprache
      const surveyId = await SurveyRepository.createSurvey(deviceId, language);
      log.info("Survey session created", { surveyId, language });
      
      // Wenn alle Fragen zurückgegeben werden sollen, können wir hier direkt zurückgeben
      if (includeAnsweredOnceQuestions) {
        return { surveyId, questions: allQuestions };
      }
      
      // Frage bereits beantwortete Fragen ab
      const answeredOnceQuestions = await AnsweredQuestionsService.getAnsweredOnceQuestions();
      log.debug("Filtering out answered showOnce questions", { 
        answeredCount: answeredOnceQuestions.length,
        totalQuestions: allQuestions.length
      });
      
      // Filtere beantwortete Fragen
      const filteredQuestions = allQuestions.filter(question => {
        // Keep questions that are not "showOnce" or haven't been answered yet
        if (!('showOnce' in question) || !question.showOnce) return true;
        return !answeredOnceQuestions.includes(question.id);
      });
      
      // Sortiere Fragen basierend auf der sequence_number
      const orderedQuestions = filteredQuestions.sort((a, b) => {
        const aSequence = a.sequence_number !== undefined ? a.sequence_number : 9999;
        const bSequence = b.sequence_number !== undefined ? b.sequence_number : 9999;
        return aSequence - bSequence;
      });
      
      log.info("Questions processed", { 
        originalCount: allQuestions.length, 
        filteredCount: filteredQuestions.length,
        finalCount: orderedQuestions.length
      });

      return { surveyId, questions: orderedQuestions };
    } catch (error) {
      log.error("Error starting survey", error);
      throw new Error("Failed to start survey");
    }
  }

  /**
   * Marks a survey as completed and notifies the slot coordinator.
   * 
   * This method focuses only on:
   * 1. Updating the survey status in the repository
   * 2. Processing answered questions to update "showOnce" status
   * 3. Notifying the SlotCoordinator that a survey was completed
   * 
   * @param surveyId The unique identifier of the completed survey
   * @param answeredQuestions Array of Question objects that were answered
   */
  static async completeSurvey(surveyId: string, answeredQuestions?: Question[]): Promise<void> {
    log.info("Completing survey", { surveyId });
    
    // 1. Mark survey as completed in the repository
    await SurveyRepository.completeSurvey(surveyId);
    
    // 2. Process answered "showOnce" questions
    if (answeredQuestions && answeredQuestions.length > 0) {
      const showOnceQuestions = answeredQuestions.filter(q => 'showOnce' in q && q.showOnce);
      
      for (const question of showOnceQuestions) {
        await AnsweredQuestionsService.markQuestionAsAnswered(question.id);
      }
      
      log.debug("Marked showOnce questions as answered", { 
        count: showOnceQuestions.length
      });
    }

    // Prüfe, ob es sich um die erste Umfrage handelt
    const firstSurveyCompleted = await this.isFirstSurveyCompleted();
    
    // 3. Notify SlotCoordinator that survey was completed
    if (!firstSurveyCompleted) {
      // Es ist die erste Umfrage
      await this.markFirstSurveyAsCompleted();
      await slotCoordinator.onSurveyEvent(SurveyEvent.FIRST_SURVEY_COMPLETED);
    } else {
      // Reguläre Umfrage
      await slotCoordinator.onSurveyEvent(SurveyEvent.SURVEY_COMPLETED);
    }
    
    log.info("Survey completed successfully");
  }

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
    await AnsweredQuestionsService.resetAnsweredQuestions();
    log.info("Reset all showOnce question data");
  }
  
  /**
   * Marks a survey as having expired without completion
   */
  static async handleSurveyExpired(): Promise<void> {
    log.info("Handling expired survey");
    await slotCoordinator.onSurveyEvent(SurveyEvent.SURVEY_EXPIRED);
  }
  
  /**
   * Überprüft, ob die erste Umfrage bereits abgeschlossen wurde
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
   * Markiert die erste Umfrage als abgeschlossen
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

export default SurveyService;
