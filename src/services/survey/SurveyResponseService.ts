import { supabase } from "../../lib/supabase";
import { SurveyResponse } from "../../types/response";
import { createLogger } from "~/src/utils/logger";
const log = createLogger("SurveyResponseService");

class SurveyResponseService {
  /**
   * Submits a user's response for a specific question.
   * @param surveyId - The survey session ID.
   * @param questionId - The question ID.
   * @param response - The user's response.
   * @throws {Error} If submission fails.
   */
  static async submitResponse(surveyId: string, questionId: string, response: any): Promise<void> {
    log.debug("Submitting response", { surveyId, questionId, response });

    const { error } = await supabase.from("responses").insert({
      survey_id: surveyId,
      question_id: questionId,
      response,
    });

    if (error) {
      log.error("Failed to submit response", error);
      throw new Error("Could not submit response.");
    }

    log.info(`Response saved for question ${questionId}`);
  }

  /**
   * Retrieves all responses for a given survey.
   * @param surveyId - The survey ID.
   * @returns A list of responses.
   * @throws {Error} If retrieval fails.
   */
  static async getResponses(surveyId: string): Promise<SurveyResponse[]> {
    log.info("Fetching responses for survey", { surveyId });

    const { data, error } = await supabase
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

export default SurveyResponseService; 