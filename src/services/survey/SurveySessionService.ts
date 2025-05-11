import { createLogger } from "~/src/utils/logger";
import { LanguageCode } from "../../locales";
import { surveyRepository, questionRepository } from "../../repositories";
import { Question } from "../../types/question";
import { DeviceIdService } from "../device";
import { ISurveySessionService } from "./interfaces/ISurveySessionService";
import { ISurveyQuestionService } from "./interfaces/ISurveyQuestionService";

const log = createLogger("SurveySessionService");

/**
 * Survey Session Management Service
 * ---------------------------------
 * 
 * This service is responsible for:
 * 1. Creating and managing survey sessions
 * 2. Starting and completing survey sessions
 */
class SurveySessionService implements ISurveySessionService {
  // Private property - will be initialized by serviceInitialization.ts
  _questionService!: ISurveyQuestionService;
  
  /**
   * Empty constructor - dependencies will be injected by serviceInitialization.ts
   */
  constructor() {}
  
  /**
   * Starts a new survey session.
   * 
   * This method:
   * 1. Creates a new survey session with device ID
   * 2. Retrieves and processes questions through the QuestionService
   * 3. Returns data needed to present the survey to the user
   * 
   * @param includeAnsweredOnceQuestions Whether to include questions marked as answered (for debugging/admin)
   * @param language The language code to use for retrieving localized questions
   * @returns Object containing survey ID and questions array
   * @throws Error if survey creation fails
   */
  async startSurvey(includeAnsweredOnceQuestions = false, language: LanguageCode = 'en'): Promise<{ surveyId: string; questions: Question[] }> {
    log.info("Starting a new survey session...", { language });

    try {
      // Parallelisiere die DeviceID-Abfrage und Fragenabruf, um Zeit zu sparen
      const deviceId = await DeviceIdService.getDeviceId();

      // Survey erstellen mit der jetzt bekannten Device-ID und Sprache
      const surveyId = await surveyRepository.createSurvey(deviceId, language);
      log.info("Survey session created", { surveyId, language });
      
      // Fragen über den SurveyQuestionService holen
      const questions = await this._questionService.getQuestionsForSurvey(includeAnsweredOnceQuestions, language);
      
      log.info("Questions processed", { 
        count: questions.length
      });

      return { surveyId, questions };
    } catch (error) {
      log.error("Error starting survey", error);
      throw new Error("Failed to start survey");
    }
  }

  /**
   * Marks a survey as completed and delegates to the SurveyLifecycleService.
   * 
   * @param surveyId The unique identifier of the completed survey
   * @param answeredQuestions Array of Question objects that were answered
   */
  async completeSurvey(surveyId: string, answeredQuestions?: Question[]): Promise<void> {
    log.info("Completing survey", { surveyId });
    
    // Mark survey as completed in the repository
    await surveyRepository.completeSurvey(surveyId);
    
    log.info("Survey marked as completed");
  }
}

/**
 * Singleton-Instanz für die OOP-Nutzung
 */
export const sessionService = new SurveySessionService();

/**
 * Default-Export der Klasse für die Instanziierung
 */
export default SurveySessionService; 