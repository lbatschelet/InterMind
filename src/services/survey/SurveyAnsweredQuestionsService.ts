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
import { ISurveyAnsweredQuestionsService } from "./interfaces/ISurveyAnsweredQuestionsService";

const log = createLogger('SurveyAnsweredQuestionsService');
const SURVEY_ANSWERED_QUESTIONS_KEY = 'answered_once_questions';

/**
 * Service for managing questions that should only be shown once per device.
 */
class SurveyAnsweredQuestionsService implements ISurveyAnsweredQuestionsService {
  /**
   * Retrieves the list of question IDs that have already been answered
   * and are marked as "showOnce".
   * 
   * @returns An array of question IDs that should not be shown again
   */
  static async getAnsweredOnceQuestions(): Promise<string[]> {
    try {
      const answeredQuestionsJson = await AsyncStorage.getItem(SURVEY_ANSWERED_QUESTIONS_KEY);
      if (!answeredQuestionsJson) {
        return [];
      }
      return JSON.parse(answeredQuestionsJson);
    } catch (error) {
      log.error("Failed to get answered questions", error);
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
      // Aktuelle Liste der beantworteten Fragen abrufen
      const answeredQuestions = await SurveyAnsweredQuestionsService.getAnsweredOnceQuestions();
      
      // Überprüfen, ob die Frage bereits in der Liste ist
      if (answeredQuestions.includes(questionId)) {
        log.debug("Question already marked as answered", { questionId });
        return;
      }
      
      // Frage zur Liste hinzufügen
      const updatedAnsweredQuestions = [...answeredQuestions, questionId];
      
      // Aktualisierte Liste speichern
      await AsyncStorage.setItem(
        SURVEY_ANSWERED_QUESTIONS_KEY,
        JSON.stringify(updatedAnsweredQuestions)
      );
      
      log.debug("Question marked as answered", { questionId });
    } catch (error) {
      log.error("Failed to mark question as answered", { questionId, error });
      throw error;
    }
  }

  /**
   * Checks if a specific question has been answered before.
   * 
   * @param questionId The ID of the question to check
   * @returns True if the question has been answered before
   */
  static async isQuestionAnswered(questionId: string): Promise<boolean> {
    const answeredQuestions = await SurveyAnsweredQuestionsService.getAnsweredOnceQuestions();
    return answeredQuestions.includes(questionId);
  }

  /**
   * Reset all answered questions (for testing purposes).
   */
  static async resetAnsweredQuestions(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SURVEY_ANSWERED_QUESTIONS_KEY);
      log.info("Reset all answered questions");
    } catch (error) {
      log.error("Failed to reset answered questions", error);
      throw error;
    }
  }

  /**
   * Implementierung des ISurveyAnsweredQuestionsService für Instanzen
   */

  /**
   * Ruft alle IDs von bereits beantworteten showOnce-Fragen ab.
   * @returns Array von Frage-IDs
   */
  async getAnsweredOnceQuestions(): Promise<string[]> {
    return SurveyAnsweredQuestionsService.getAnsweredOnceQuestions();
  }

  /**
   * Markiert eine Frage als beantwortet, so dass sie in zukünftigen Umfragen nicht mehr angezeigt wird.
   * @param questionId ID der Frage, die markiert werden soll
   */
  async markQuestionAsAnswered(questionId: string): Promise<void> {
    return SurveyAnsweredQuestionsService.markQuestionAsAnswered(questionId);
  }

  /**
   * Prüft, ob eine Frage bereits als beantwortet markiert wurde.
   * @param questionId Die zu prüfende Frage-ID
   * @returns True, wenn die Frage als beantwortet markiert wurde
   */
  async isQuestionAnswered(questionId: string): Promise<boolean> {
    return SurveyAnsweredQuestionsService.isQuestionAnswered(questionId);
  }

  /**
   * Setzt die Liste der beantworteten Fragen zurück.
   * Nützlich für Tests oder wenn alle Fragen wieder angezeigt werden sollen.
   */
  async resetAnsweredQuestions(): Promise<void> {
    return SurveyAnsweredQuestionsService.resetAnsweredQuestions();
  }
}

export default SurveyAnsweredQuestionsService; 