import { createLogger } from "~/src/utils/logger";
import { SurveyRepository } from "../repositories/SurveyRepository";
import { Question } from "../types/question";
import AnsweredQuestionsService from "./AnsweredQuestionsService";
import { DeviceService } from "./DeviceService";

const log = createLogger("SurveyService");

class SurveyService {
  /**
   * Starts a new survey session.
   * @param includeAnsweredOnceQuestions Optional flag to include all questions, even those marked as showOnce that have been answered before
   * @returns The new survey ID and its questions.
   */
  static async startSurvey(includeAnsweredOnceQuestions = false): Promise<{ surveyId: string; questions: Question[] }> {
    log.info("Starting a new survey session...");

    try {
      // Parallelisiere die DeviceID-Abfrage und Fragenabruf, um Zeit zu sparen
      const [deviceId, allQuestions] = await Promise.all([
        DeviceService.getDeviceId(),
        SurveyRepository.fetchQuestions()
      ]);

      // Survey erstellen mit der jetzt bekannten Device-ID
      const surveyId = await SurveyRepository.createSurvey(deviceId);
      log.info("Survey session created", { surveyId });
      
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
   * Marks a survey as completed.
   * @param surveyId The survey ID.
   * @param answeredQuestions IDs of questions that were answered in this survey
   */
  static async completeSurvey(surveyId: string, answeredQuestions?: Question[]): Promise<void> {
    log.info("Completing survey", { surveyId });
    await SurveyRepository.completeSurvey(surveyId);
    
    // If we have answered questions, mark the "showOnce" ones as answered
    if (answeredQuestions && answeredQuestions.length > 0) {
      const showOnceQuestions = answeredQuestions.filter(q => 'showOnce' in q && q.showOnce);
      
      for (const question of showOnceQuestions) {
        await AnsweredQuestionsService.markQuestionAsAnswered(question.id);
      }
      
      log.debug("Marked showOnce questions as answered", { 
        count: showOnceQuestions.length
      });
    }
  }

  /**
   * Deletes all surveys for the current device.
   * This will also reset all answered questions, so they will be shown again.
   * 
   * @returns {Promise<boolean>} True if successful, false if an error occurs.
   */
  static async deleteAllSurveys(): Promise<boolean> {
    log.info("Deleting all survey data and resetting question flags");
    return DeviceService.deleteDeviceData();
  }
  
  /**
   * Resets all "showOnce" question data, allowing previously answered
   * questions to be shown again (for testing or upon user request).
   */
  static async resetAnsweredOnceQuestions(): Promise<void> {
    await AnsweredQuestionsService.resetAnsweredQuestions();
    log.info("Reset all showOnce question data");
  }
}

export default SurveyService;
