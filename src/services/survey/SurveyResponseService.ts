import { supabase } from "../../lib/supabase";
import { SurveyResponse } from "../../types/response";
import { createLogger } from "~/src/utils/logger";
import { questionRepository } from "../../repositories";
import SurveyAnsweredQuestionsService from "./SurveyAnsweredQuestionsService";
import { Question } from "../../types/question";
import { ISurveyResponseService } from "./interfaces/ISurveyResponseService";
import { IQuestionRepository } from "../../repositories/interfaces/IQuestionRepository";
import { ISurveyQuestionService } from "./interfaces/ISurveyQuestionService";
import { ISurveyAnsweredQuestionsService } from "./interfaces/ISurveyAnsweredQuestionsService";

const log = createLogger("SurveyResponseService");

/**
 * Service zur Verwaltung von Umfrageantworten
 */
class SurveyResponseService implements ISurveyResponseService {
  // Private properties - will be initialized by serviceInitialization.ts
  // but marked as public for TypeScript (since they're set via Object.defineProperties)
  _questionService!: ISurveyQuestionService;
  _questionRepo!: IQuestionRepository;
  _answeredQuestionsService!: ISurveyAnsweredQuestionsService;
  _supabaseClient: any;
  
  /**
   * Empty constructor - dependencies will be injected by serviceInitialization.ts
   */
  constructor() {}
  
  /**
   * Speichert eine Antwort für eine bestimmte Frage.
   * 
   * @param surveyId Die ID der Umfrage
   * @param questionId Die ID der Frage
   * @param response Die Antwort (kann ein beliebiger Wert sein)
   * @returns Promise, das erfüllt wird, wenn die Antwort gespeichert wurde
   */
  async submitResponse(surveyId: string, questionId: string, response: unknown): Promise<void> {
    log.debug("Submitting response", { surveyId, questionId, response });

    // Handle undefined responses to avoid database not-null constraint violation
    const safeResponse = response === undefined ? { viewed: true } : response;

    // Insert response into database
    const { error } = await this._supabaseClient
      .from("responses")
      .insert({
        survey_id: surveyId,
        question_id: questionId,
        response: safeResponse,
      });

    if (error) {
      log.error("Failed to submit response", error);
      throw new Error("Could not submit response.");
    }

    log.info(`Response saved for question ${questionId}`);
  }
  
  /**
   * Markiert Fragen, die nur einmal angezeigt werden sollen, als beantwortet.
   * 
   * @param questionIds Die IDs der beantworteten Fragen
   * @returns Promise, das erfüllt wird, wenn die Fragen markiert wurden
   */
  async markShowOnceQuestionsAsAnswered(questionIds: string[]): Promise<void> {
    try {
      const allQuestions = await this._questionRepo.fetchQuestions(false);
      
      // Find all showOnce questions that were answered in this survey
      const showOnceQuestions = allQuestions.filter(q => 
        'showOnce' in q && 
        q.showOnce && 
        questionIds.includes(q.id)
      );

      // Mark each showOnce question as answered
      for (const question of showOnceQuestions) {
        log.debug("Marking showOnce question as answered", { questionId: question.id });
        await this._answeredQuestionsService.markQuestionAsAnswered(question.id);
      }
    } catch (error) {
      log.error("Error marking showOnce questions as answered", error);
      // Don't throw - this is not critical for survey completion
    }
  }
  
  /**
   * Ruft alle Antworten für eine bestimmte Umfrage ab.
   * 
   * @param surveyId Die ID der Umfrage
   * @returns Ein Objekt mit den Frage-IDs als Schlüssel und den Antworten als Werte
   */
  async getResponsesForSurvey(surveyId: string): Promise<Record<string, unknown>> {
    const responses = await this.getResponses(surveyId);
    
    // Konvertiert die Antworten in ein Objekt mit der Frage-ID als Schlüssel
    const responseMap: Record<string, unknown> = {};
    responses.forEach(response => {
      responseMap[response.questionId] = response.response;
    });
    
    return responseMap;
  }
  
  /**
   * Verarbeitet eine Antwort und wendet bedingte Logik an.
   * 
   * Diese Methode kombiniert die Speicherung der Antwort mit der Anwendung
   * der bedingten Logik zur Ausblendung von Fragen.
   * 
   * @param surveyId Die ID der Umfrage
   * @param questionId Die ID der Frage
   * @param response Die Antwort
   * @param allQuestions Alle verfügbaren Fragen
   * @param currentResponses Der aktuelle Antworten-Cache
   * @returns Die aktualisierten Fragen und Antworten nach Anwendung der bedingten Logik
   */
  async processResponse(
    surveyId: string,
    questionId: string,
    response: unknown,
    allQuestions: Question[],
    currentResponses: Record<string, unknown>
  ): Promise<{
    filteredQuestions: Question[];
    updatedResponses: Record<string, unknown>;
  }> {
    // Speichere die Antwort in der Datenbank
    await this.submitResponse(surveyId, questionId, response);
    
    // Aktualisiere den lokalen Antworten-Cache
    const updatedResponses = {
      ...currentResponses,
      [questionId]: response
    };
    
    let filteredQuestions = allQuestions;
    try {
      // Sicherheitscheck für questionService - fallback to unfiltered questions if not available
      if (this._questionService && typeof this._questionService.filterQuestionsBasedOnResponses === 'function') {
        // Filtere Fragen basierend auf den aktualisierten Antworten
        filteredQuestions = this._questionService.filterQuestionsBasedOnResponses(
          allQuestions,
          updatedResponses
        );
        
        log.debug("Response processed with conditional logic", {
          questionId,
          originalQuestionCount: allQuestions.length,
          filteredQuestionCount: filteredQuestions.length
        });
      } else {
        log.warn("QuestionService unavailable, skipping conditional filtering", { questionId });
      }
    } catch (error) {
      log.error("Error filtering questions", error);
      // Fallback to unfiltered questions
      filteredQuestions = allQuestions;
    }
    
    return {
      filteredQuestions,
      updatedResponses
    };
  }

  /**
   * Hilfsmethode zum Abrufen von Antworten aus der Datenbank
   * @private
   */
  private async getResponses(surveyId: string): Promise<SurveyResponse[]> {
    log.info("Fetching responses for survey", { surveyId });

    const { data, error } = await this._supabaseClient
      .from("responses")
      .select("*")
      .eq("survey_id", surveyId);

    if (error) {
      log.error("Failed to fetch responses", error);
      throw new Error("Could not retrieve responses.");
    }

    return data;
  }
}

/**
 * Singleton-Instanz für die OOP-Nutzung
 * NOTE: This is deprecated - use the one from serviceInitialization instead
 */
export const responseService = new SurveyResponseService();

/**
 * Default-Export der Klasse für die Instanziierung
 */
export default SurveyResponseService; 