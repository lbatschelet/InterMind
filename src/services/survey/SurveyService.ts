import { createLogger } from "~/src/utils/logger";
import { LanguageCode } from "../../locales";
import { Question } from "../../types/question";
import { FIRST_SURVEY_CHECKED_KEY } from "../../constants/storageKeys";
import { 
  sessionService,
  lifecycleService,
  availabilityService,
  dataService,
  responseService,
  questionService,
  navigationService,
  locationService
} from "./serviceInitialization";

// Re-export für den einfachen Zugriff
export { 
  questionService, 
  navigationService, 
  responseService,
  sessionService,
  lifecycleService,
  availabilityService,
  dataService,
  locationService
};

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
 * - SurveyQuestionService: Managing questions and conditional logic
 * - SurveyNavigationService: Managing survey navigation
 * - SurveyResponseService: Managing survey responses
 * 
 * It maintains the original API for backward compatibility while
 * delegating to the specialized services.
 */
class SurveyService {
  /**
   * Prüft, ob eine Umfrage aktuell verfügbar ist
   */
  static async isSurveyAvailable(): Promise<boolean> {
    return await availabilityService.isSurveyAvailable();
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
    return await sessionService.startSurvey(includeAnsweredOnceQuestions, language);
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
    await sessionService.completeSurvey(surveyId);
    
    // 2. If we have answered questions, mark showOnce questions as answered
    if (answeredQuestions && answeredQuestions.length > 0) {
      const questionIds = answeredQuestions.map(q => q.id);
      await responseService.markShowOnceQuestionsAsAnswered(questionIds);
    }
    
    // 3. Process completion events via LifecycleService
    await lifecycleService.processSurveyCompletion(answeredQuestions);
    
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
    return await dataService.deleteAllSurveys();
  }
  
  /**
   * Resets the "showOnce" question tracking, making previously
   * answered questions show up again in future surveys.
   * 
   * Delegates to SurveyDataService.
   */
  static async resetAnsweredOnceQuestions(): Promise<void> {
    await dataService.resetAnsweredOnceQuestions();
  }
  
  /**
   * Marks a survey as having expired without completion.
   * 
   * Delegates to SurveyLifecycleService.
   */
  static async handleSurveyExpired(): Promise<void> {
    await lifecycleService.handleSurveyExpired();
  }
  
  /**
   * Überprüft, ob die erste Umfrage bereits abgeschlossen wurde.
   * 
   * Delegates to SurveyLifecycleService.
   */
  static async isFirstSurveyCompleted(): Promise<boolean> {
    return await lifecycleService.isFirstSurveyCompleted();
  }
  
  /**
   * Markiert die erste Umfrage als abgeschlossen.
   * 
   * Delegates to SurveyLifecycleService.
   */
  static async markFirstSurveyAsCompleted(): Promise<void> {
    await lifecycleService.markFirstSurveyAsCompleted();
  }

  /**
   * Filtert Fragen basierend auf den aktuellen Antworten.
   * 
   * Delegiert an SurveyQuestionService.filterQuestionsBasedOnResponses.
   * 
   * @param questions Alle verfügbaren Fragen
   * @param responses Aktuelle Antworten der Umfrage
   * @returns Gefilterte und sortierte Liste von Fragen
   */
  static filterQuestionsBasedOnResponses(questions: Question[], responses: Record<string, unknown>): Question[] {
    log.debug("Delegating question filtering to SurveyQuestionService");
    return questionService.filterQuestionsBasedOnResponses(questions, responses);
  }

  /**
   * Bestimmt den geeigneten Index für die Navigation bei geänderter Fragenliste.
   * 
   * Delegiert an SurveyQuestionService.findAppropriateQuestionIndex.
   * 
   * @param filteredQuestions Die gefilterte Liste der sichtbaren Fragen
   * @param currentQuestion Die aktuelle Frage
   * @param fallbackIndex Der Index, der verwendet wird, wenn keine passende Frage gefunden wird
   * @returns Der Index für die nächste Frage in der gefilterten Liste
   */
  static findAppropriateQuestionIndex(
    filteredQuestions: Question[], 
    currentQuestion: Question | undefined, 
    fallbackIndex: number = 0
  ): number {
    log.debug("Delegating navigation index calculation to SurveyQuestionService");
    return questionService.findAppropriateQuestionIndex(
      filteredQuestions,
      currentQuestion,
      fallbackIndex
    );
  }

  /**
   * Prüft, ob die Verzweigungslogik zu Änderungen in der Fragenliste geführt hat,
   * die eine Anpassung des aktuellen Index erfordern könnten.
   * 
   * Delegiert an SurveyQuestionService.shouldAdjustNavigation.
   * 
   * @param originalQuestions Die ursprüngliche Fragenliste
   * @param filteredQuestions Die gefilterte Fragenliste
   * @param currentIndex Der aktuelle Index
   * @returns true, wenn Anpassungen nötig sind, sonst false
   */
  static shouldAdjustNavigation(
    originalQuestions: Question[], 
    filteredQuestions: Question[], 
    currentIndex: number
  ): boolean {
    log.debug("Delegating navigation adjustment check to SurveyQuestionService");
    return questionService.shouldAdjustNavigation(
      originalQuestions,
      filteredQuestions,
      currentIndex
    );
  }
  
  /**
   * Berechnet den Index der nächsten Frage basierend auf dem aktuellen Index.
   * 
   * Delegiert an den SurveyNavigationService.
   * 
   * @param currentIndex Der aktuelle Frageindex
   * @param questions Die Liste aller (gefilterten) Fragen
   * @returns Der Index der nächsten Frage oder -1, wenn keine weitere Frage vorhanden ist
   */
  static calculateNextIndex(currentIndex: number, questions: Question[]): number {
    log.debug("Delegating next index calculation to SurveyNavigationService");
    return navigationService.calculateNextIndex(currentIndex, questions);
  }
  
  /**
   * Berechnet den Index der vorherigen Frage basierend auf dem aktuellen Index.
   * 
   * Delegiert an den SurveyNavigationService.
   * 
   * @param currentIndex Der aktuelle Frageindex
   * @param questions Die Liste aller (gefilterten) Fragen
   * @returns Der Index der vorherigen Frage oder -1, wenn keine vorherige Frage vorhanden ist
   */
  static calculatePreviousIndex(currentIndex: number, questions: Question[]): number {
    log.debug("Delegating previous index calculation to SurveyNavigationService");
    return navigationService.calculatePreviousIndex(currentIndex, questions);
  }
  
  /**
   * Prüft, ob die Umfrage nach der aktuellen Frage beendet werden sollte.
   * 
   * Delegiert an den SurveyNavigationService.
   * 
   * @param currentIndex Der aktuelle Frageindex
   * @param questions Die Liste aller (gefilterten) Fragen
   * @returns true, wenn die Umfrage abgeschlossen werden sollte, sonst false
   */
  static shouldCompleteOnNext(currentIndex: number, questions: Question[]): boolean {
    log.debug("Delegating completion check to SurveyNavigationService");
    return navigationService.shouldCompleteOnNext(currentIndex, questions);
  }
  
  /**
   * Behandelt die Aktualisierung des Navigationsindex nach Änderungen an der Fragenliste.
   * 
   * Delegiert an den SurveyNavigationService.
   * 
   * @param allQuestions Alle ursprünglichen Fragen
   * @param filteredQuestions Die gefilterte Liste von Fragen
   * @param currentIndex Der aktuelle Frageindex
   * @param currentQuestion Die aktuelle Frage
   * @returns Der aktualisierte Index basierend auf den Filteränderungen
   */
  static handleFilteredQuestionsUpdate(
    allQuestions: Question[],
    filteredQuestions: Question[],
    currentIndex: number, 
    currentQuestion: Question | undefined
  ): number {
    log.debug("Delegating filtered questions update to SurveyNavigationService");
    return navigationService.handleFilteredQuestionsUpdate(
      allQuestions,
      filteredQuestions,
      currentIndex,
      currentQuestion
    );
  }
  
  /**
   * Verarbeitet eine Antwort und wendet bedingte Logik an.
   * 
   * Delegiert an den SurveyResponseService.
   * 
   * @param surveyId Die ID der Umfrage
   * @param questionId Die ID der Frage
   * @param response Die Antwort
   * @param allQuestions Alle verfügbaren Fragen
   * @param currentResponses Der aktuelle Antworten-Cache
   * @returns Die aktualisierten Fragen und Antworten nach Anwendung der bedingten Logik
   */
  static async processResponse(
    surveyId: string,
    questionId: string,
    response: unknown,
    allQuestions: Question[],
    currentResponses: Record<string, unknown>
  ): Promise<{
    filteredQuestions: Question[];
    updatedResponses: Record<string, unknown>;
  }> {
    log.debug("Delegating response processing to SurveyResponseService");
    return responseService.processResponse(
      surveyId,
      questionId,
      response,
      allQuestions,
      currentResponses
    );
  }
}

export default SurveyService;
