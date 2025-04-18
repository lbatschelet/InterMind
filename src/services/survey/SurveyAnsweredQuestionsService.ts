/**
 * @packageDocumentation
 * @module Services/Survey/SurveyAnsweredQuestionsService
 * 
 * @summary
 * Service to manage "showOnce" questions that have been already answered.
 * 
 * @remarks
 * Uses AsyncStorage to persist which questions should only be shown once,
 * so they can be filtered out in future surveys for the same device.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLogger } from '~/src/utils/logger';

const log = createLogger('SurveyAnsweredQuestionsService');
const STORAGE_KEY = 'answered_once_questions';

/**
 * Service for managing questions that should only be shown once per device.
 */
class SurveyAnsweredQuestionsService {
  /**
   * Retrieves the list of question IDs that have already been answered
   * and are marked as "showOnce".
   * 
   * @returns An array of question IDs that should not be shown again
   */
  static async getAnsweredOnceQuestions(): Promise<string[]> {
    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (!storedData) {
        log.debug('No answered once questions found in storage');
        return [];
      }

      const answeredQuestions = JSON.parse(storedData) as string[];
      log.debug('Retrieved answered once questions', { count: answeredQuestions.length });
      return answeredQuestions;
    } catch (error) {
      log.error('Failed to retrieve answered once questions', error);
      return [];
    }
  }

  /**
   * Marks a question as answered, so it won't be shown again
   * if it has the "showOnce" flag.
   * 
   * @param questionId The ID of the question that was answered
   */
  static async markQuestionAsAnswered(questionId: string): Promise<void> {
    try {
      const answeredQuestions = await this.getAnsweredOnceQuestions();
      
      // Skip if already marked as answered
      if (answeredQuestions.includes(questionId)) {
        return;
      }

      // Add question ID to the list and save
      const updatedQuestions = [...answeredQuestions, questionId];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedQuestions));
      
      log.debug('Marked question as answered', { questionId });
    } catch (error) {
      log.error('Failed to mark question as answered', error);
    }
  }

  /**
   * Checks if a specific question has been answered before.
   * 
   * @param questionId The ID of the question to check
   * @returns True if the question has been answered before
   */
  static async hasAnsweredQuestion(questionId: string): Promise<boolean> {
    const answeredQuestions = await this.getAnsweredOnceQuestions();
    return answeredQuestions.includes(questionId);
  }

  /**
   * Reset all answered questions (for testing purposes).
   */
  static async resetAnsweredQuestions(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      log.info('Reset all answered questions');
    } catch (error) {
      log.error('Failed to reset answered questions', error);
    }
  }
}

export default SurveyAnsweredQuestionsService; 