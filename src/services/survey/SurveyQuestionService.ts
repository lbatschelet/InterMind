import { createLogger } from "~/src/utils/logger";
import { LanguageCode } from "../../locales";
import { questionRepository } from "../../repositories";
import { Question } from "../../types/question";
import SurveyAnsweredQuestionsService from "./SurveyAnsweredQuestionsService";

const log = createLogger("SurveyQuestionService");

/**
 * Survey Question Management Service
 * ----------------------------------
 * 
 * This service is responsible for:
 * 1. Retrieving questions from the repository
 * 2. Filtering questions based on previous answers
 * 3. Sorting questions based on sequence
 */
class SurveyQuestionService {
  /**
   * Retrieves and processes questions for a survey.
   * 
   * Filtering logic:
   * - Removes questions marked as "showOnce" that have been previously answered
   * 
   * @param includeAnsweredOnceQuestions Whether to include questions marked as answered (for debugging/admin)
   * @param language The language code to use for retrieving localized questions
   * @returns Filtered and sorted array of questions
   */
  static async getQuestionsForSurvey(includeAnsweredOnceQuestions = false, language: LanguageCode = 'en'): Promise<Question[]> {
    try {
      // Fetch all questions from the repository
      const allQuestions = await questionRepository.fetchQuestions(false, language);
      
      // If all questions should be returned, return them directly
      if (includeAnsweredOnceQuestions) {
        return allQuestions;
      }
      
      // Fetch previously answered questions
      const answeredOnceQuestions = await SurveyAnsweredQuestionsService.getAnsweredOnceQuestions();
      log.debug("Filtering out answered showOnce questions", { 
        answeredCount: answeredOnceQuestions.length,
        totalQuestions: allQuestions.length
      });
      
      // Filter out previously answered "showOnce" questions
      const filteredQuestions = allQuestions.filter(question => {
        // Keep questions that are not "showOnce" or haven't been answered yet
        if (!('showOnce' in question) || !question.showOnce) return true;
        return !answeredOnceQuestions.includes(question.id);
      });
      
      // Sort questions based on sequence number
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
      
      return orderedQuestions;
    } catch (error) {
      log.error("Error processing questions", error);
      return [];
    }
  }
}

export default SurveyQuestionService; 