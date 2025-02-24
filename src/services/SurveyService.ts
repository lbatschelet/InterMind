import { SurveyRepository } from "../repositories/SurveyRepository";
import { DeviceService } from "./DeviceService";
import { Question } from "../types/question";
import { createLogger } from "~/src/utils/logger";

const log = createLogger("SurveyService");

class SurveyService {
  /**
   * Starts a new survey session.
   * @returns The new survey ID and its questions.
   */
  static async startSurvey(): Promise<{ surveyId: string; questions: Question[] }> {
    log.info("Starting a new survey session...");

    // Get the device ID
    const deviceId = await DeviceService.getDeviceId();

    // Create survey
    const surveyId = await SurveyRepository.createSurvey(deviceId);
    log.info("Survey session created", { surveyId });

    // Fetch questions
    const questions = await SurveyRepository.fetchQuestions();

    return { surveyId, questions };
  }

  /**
   * Marks a survey as completed.
   * @param surveyId The survey ID.
   */
  static async completeSurvey(surveyId: string): Promise<void> {
    log.info("Completing survey", { surveyId });
    await SurveyRepository.completeSurvey(surveyId);
  }

  /**
   * Deletes all surveys for the current device.
   * 
   * @returns {Promise<boolean>} True if successful, false if an error occurs.
   */
  static async deleteAllSurveys(): Promise<boolean> {
    const deviceId = await DeviceService.getDeviceId();
    return SurveyRepository.deleteAllSurveys(deviceId);
  }
}

export default SurveyService;
