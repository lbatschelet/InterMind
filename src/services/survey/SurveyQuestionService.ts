import { createLogger } from "~/src/utils/logger";
import { LanguageCode } from "../../locales";
import { questionRepository } from "../../repositories";
import { Question } from "../../types/question";
import SurveyAnsweredQuestionsService from "./SurveyAnsweredQuestionsService";
import { OptionType } from "../../components/QuestionTypes/OptionsSelector";
import { ISurveyQuestionService } from "./interfaces/ISurveyQuestionService";
import { IQuestionRepository } from "../../repositories/interfaces/IQuestionRepository";
import { ISurveyAnsweredQuestionsService } from "./interfaces/ISurveyAnsweredQuestionsService";
import { ISurveyNavigationService } from "./interfaces/ISurveyNavigationService";

const log = createLogger("SurveyQuestionService");

/**
 * Survey Question Management Service
 * ----------------------------------
 * 
 * This service is responsible for:
 * 1. Retrieving questions from the repository
 * 2. Filtering questions based on previous answers
 * 3. Sorting questions based on sequence
 * 4. Managing conditional question logic
 */
class SurveyQuestionService implements ISurveyQuestionService {
  // Private properties - will be initialized by serviceInitialization.ts
  // but marked as public for TypeScript (since they're set via Object.defineProperties)
  _questionRepo!: IQuestionRepository;
  _answeredQuestionsService!: ISurveyAnsweredQuestionsService;
  _navigationService!: ISurveyNavigationService;

  /**
   * Empty constructor - dependencies will be injected by serviceInitialization.ts
   */
  constructor() {}

  /**
   * Ruft Fragen für eine Umfrage ab und verarbeitet sie.
   * 
   * Filtering logic:
   * - Removes questions marked as "showOnce" that have been previously answered
   * 
   * @param includeAnsweredOnceQuestions Whether to include questions marked as answered (for debugging/admin)
   * @param language The language code to use for retrieving localized questions
   * @returns Filtered and sorted array of questions
   */
  async getQuestionsForSurvey(includeAnsweredOnceQuestions = false, language: LanguageCode = 'en'): Promise<Question[]> {
    try {
      // Fetch all questions from the repository
      const allQuestions = await this._questionRepo.fetchQuestions(false, language);
      
      // If all questions should be returned, return them directly
      if (includeAnsweredOnceQuestions) {
        return allQuestions;
      }
      
      // Fetch previously answered questions
      const answeredOnceQuestions = await this._answeredQuestionsService.getAnsweredOnceQuestions();
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
      const orderedQuestions = this.sortQuestionsBySequence(filteredQuestions);
      
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

  /**
   * Sortiert Fragen nach ihrer Sequenznummer.
   * 
   * @param questions Die zu sortierenden Fragen
   * @returns Die sortierten Fragen
   */
  private sortQuestionsBySequence(questions: Question[]): Question[] {
    return [...questions].sort((a, b) => {
      const aSequence = a.sequence_number !== undefined ? a.sequence_number : 9999;
      const bSequence = b.sequence_number !== undefined ? b.sequence_number : 9999;
      return aSequence - bSequence;
    });
  }

  /**
   * Filtert Fragen basierend auf den aktuellen Antworten.
   * 
   * Implementiert eine bedingte Filterlogik, die bestimmte Fragen basierend auf den
   * Antwortauswahlen ausblendet. Bei mehreren Auswahlmöglichkeiten (Multiple-Choice) gilt
   * die XOR-Logik, bei der die letzte Auswahl entscheidend ist.
   * 
   * @param questions Alle verfügbaren Fragen
   * @param responses Aktuelle Antworten im Format { questionId: response }
   * @returns Gefilterte und sortierte Liste von Fragen
   */
  filterQuestionsBasedOnResponses(
    questions: Question[],
    responses: Record<string, unknown>
  ): Question[] {
    // IDs der zu versteckenden Fragen sammeln
    const hiddenQuestionIds = new Set<string>();

    log.debug("Filtering questions based on responses", { 
      questionCount: questions.length,
      responseCount: Object.keys(responses).length 
    });
    
    // Durchlaufe alle Antworten
    Object.entries(responses).forEach(([questionId, response]) => {
      // Die aktuelle Frage finden
      const question = questions.find(q => q.id === questionId);
      
      // Nur weiter, wenn die Frage gefunden wurde und options hat
      if (!question || !question.options || !Array.isArray(question.options)) {
        return;
      }
      
      // Extrahiere die hideQuestions-Listen basierend auf dem Fragetyp
      if (question.type === 'single_choice' && typeof response === 'string') {
        // Für Single-Choice: Einfach die Option mit dem ausgewählten Wert finden
        const selectedOption = question.options.find(
          opt => 'value' in opt && opt.value === response
        ) as OptionType | undefined;
        
        if (selectedOption?.hideQuestions) {
          log.debug("Found hideQuestions in single_choice response", { 
            questionId, 
            response, 
            hideQuestions: selectedOption.hideQuestions 
          });
          
          // Füge alle zu versteckenden Fragen zur Set hinzu
          selectedOption.hideQuestions.forEach(id => hiddenQuestionIds.add(id));
        }
      } 
      else if (question.type === 'multiple_choice' && Array.isArray(response) && response.length > 0) {
        // Für Multiple-Choice: XOR-Logik - nur die letzte Auswahl verwenden
        const lastSelectedValue = response[response.length - 1];
        
        // Die entsprechende Option finden
        const lastSelectedOption = question.options.find(
          opt => 'value' in opt && opt.value === lastSelectedValue
        ) as OptionType | undefined;
        
        if (lastSelectedOption?.hideQuestions) {
          log.debug("Found hideQuestions in last multiple_choice selection", { 
            questionId, 
            lastSelection: lastSelectedValue, 
            hideQuestions: lastSelectedOption.hideQuestions 
          });
          
          // Füge alle zu versteckenden Fragen zur Set hinzu
          lastSelectedOption.hideQuestions.forEach(id => hiddenQuestionIds.add(id));
        }
      }
    });
    
    // Filtere die Fragen, bei denen die ID nicht in hiddenQuestionIds vorkommt
    const visibleQuestions = questions.filter(q => !hiddenQuestionIds.has(q.id));
    
    log.debug("Questions filtered based on responses", { 
      originalCount: questions.length,
      hiddenCount: hiddenQuestionIds.size,
      visibleCount: visibleQuestions.length
    });
    
    // Sortiere nach sequence_number
    return this.sortQuestionsBySequence(visibleQuestions);
  }

  /**
   * Bestimmt den geeigneten Index für die Navigation bei geänderter Fragenliste.
   * 
   * @param filteredQuestions Die gefilterte Liste der sichtbaren Fragen
   * @param currentQuestion Die aktuelle Frage
   * @param fallbackIndex Der Standard-Index, falls keine passende Frage gefunden wird
   * @returns Den Index für die nächste Frage in der gefilterten Liste
   */
  findAppropriateQuestionIndex(
    filteredQuestions: Question[],
    currentQuestion: Question | undefined,
    fallbackIndex: number = 0
  ): number {
    try {
      // Ensure navigationService is available before delegating
      if (this._navigationService && typeof this._navigationService.findAppropriateQuestionIndex === 'function') {
        // Delegiere an den NavigationService, der die eigentliche Logik implementiert
        return this._navigationService.findAppropriateQuestionIndex(
          filteredQuestions,
          currentQuestion,
          fallbackIndex
        );
      } else {
        log.warn("NavigationService unavailable, using fallback index", { fallbackIndex });
        return fallbackIndex;
      }
    } catch (error) {
      log.error("Error in findAppropriateQuestionIndex", error);
      return fallbackIndex;
    }
  }

  /**
   * Prüft, ob die Verzweigungslogik zu Änderungen in der Fragenliste geführt hat,
   * die eine Anpassung des aktuellen Index erfordern könnten.
   * 
   * @param originalQuestions Die ursprüngliche Fragenliste
   * @param filteredQuestions Die gefilterte Fragenliste
   * @param currentIndex Der aktuelle Index
   * @returns true, wenn Anpassungen nötig sind, sonst false
   */
  shouldAdjustNavigation(
    originalQuestions: Question[],
    filteredQuestions: Question[],
    currentIndex: number
  ): boolean {
    try {
      // Ensure navigationService is available before delegating
      if (this._navigationService && typeof this._navigationService.shouldAdjustNavigation === 'function') {
        // Delegiere an den NavigationService, der die eigentliche Logik implementiert
        return this._navigationService.shouldAdjustNavigation(
          originalQuestions,
          filteredQuestions,
          currentIndex
        );
      } else {
        log.warn("NavigationService unavailable, skipping navigation adjustment check");
        return false;
      }
    } catch (error) {
      log.error("Error in shouldAdjustNavigation", error);
      return false;
    }
  }
}

/**
 * Singleton-Instanz für die OOP-Nutzung
 * NOTE: This is deprecated - use the one from serviceInitialization instead
 */
export const questionService = new SurveyQuestionService();

/**
 * Default-Export der Klasse für statische Nutzung (Legacy)
 */
export default SurveyQuestionService; 