/**
 * @packageDocumentation
 * @module Hooks
 * 
 * @summary
 * Hook zur Verwaltung von Umfrageantworten
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { Question } from '../types/question';
import { createLogger } from '../utils/logger';
import { questionService, responseService } from '../services/survey/serviceInitialization';

const log = createLogger("useSurveyResponses");

/**
 * Custom hook that manages the state and persistence of survey responses
 * 
 * @param surveyId The ID of the current survey
 * @param initialQuestions Initial set of questions for the survey
 * @returns Object containing response management functions and state
 */
export const useSurveyResponses = (surveyId: string, initialQuestions: Question[]) => {
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(initialQuestions);
  const responseCache = useRef<Record<string, unknown>>({});

  /**
   * Verarbeitet eine Antwort und aktualisiert den lokalen Zustand
   * 
   * @param questionId ID der Frage
   * @param response Antwort auf die Frage (beliebiger Typ)
   * @returns Die gefilterten Fragen nach der Anwendung der bedingten Logik
   */
  const updateResponse = useCallback(async (questionId: string, response: unknown): Promise<Question[]> => {
    try {
      log.debug("Updating response", { questionId, response });
      
      // Verwende den Service, um die Antwort zu verarbeiten
      const result = await responseService.processResponse(
        surveyId,
        questionId,
        response,
        initialQuestions,
        responseCache.current
      );
      
      // Aktualisiere den lokalen Cache und die gefilterten Fragen
      responseCache.current = result.updatedResponses;
      setFilteredQuestions(result.filteredQuestions);
      
      log.debug("Response updated and filtered questions", { 
        questionId, 
        originalCount: initialQuestions.length,
        filteredCount: result.filteredQuestions.length
      });
      
      // Gib die gefilterten Fragen zurück
      return result.filteredQuestions;
    } catch (error) {
      log.error("Failed to update response", error);
      
      // Im Fehlerfall: Füge die Antwort nur lokal zum Cache hinzu
      responseCache.current = {
        ...responseCache.current,
        [questionId]: response
      };
      
      // Make sure to handle potential undefined questionService
      let localFiltered = initialQuestions;
      try {
        // Wende die Filterung lokal an, if questionService is available
        if (questionService && typeof questionService.filterQuestionsBasedOnResponses === 'function') {
          localFiltered = questionService.filterQuestionsBasedOnResponses(
            initialQuestions,
            responseCache.current
          );
        } else {
          log.warn("QuestionService unavailable, using unfiltered questions");
        }
      } catch (innerError) {
        log.error("Error in local filtering", innerError);
      }
      
      setFilteredQuestions(localFiltered);
      return localFiltered;
    }
  }, [surveyId, initialQuestions]);

  /**
   * Lädt alle Antworten für die aktuelle Umfrage
   */
  const loadResponses = useCallback(async () => {
    try {
      log.debug("Loading survey responses");
      
      // Abrufen der Antworten vom Service
      const responses = await responseService.getResponsesForSurvey(surveyId);
      
      // Aktualisieren des lokalen Cache
      responseCache.current = responses;
      
      // Make sure questionService is available
      let filtered = initialQuestions;
      if (questionService && typeof questionService.filterQuestionsBasedOnResponses === 'function') {
        // Anwenden der Filterlogik
        filtered = questionService.filterQuestionsBasedOnResponses(
          initialQuestions,
          responses
        );
      } else {
        log.warn("QuestionService unavailable, using unfiltered questions");
      }
      
      // Aktualisieren der gefilterten Fragen
      setFilteredQuestions(filtered);
      
      log.debug("Responses loaded and questions filtered", { 
        responseCount: Object.keys(responses).length,
        filteredCount: filtered.length
      });
    } catch (error) {
      log.error("Failed to load responses", error);
      // Im Fehlerfall: Verwende die ungefilterten Fragen
      setFilteredQuestions(initialQuestions);
    }
  }, [surveyId, initialQuestions]);

  /**
   * Lädt Antworten, wenn der Hook initialisiert wird
   */
  useEffect(() => {
    if (surveyId) {
      loadResponses();
    }
  }, [loadResponses, surveyId]);

  /**
   * Ruft eine Antwort für eine bestimmte Frage ab
   * @param questionId ID der Frage
   * @returns Die Antwort oder undefined, wenn keine Antwort vorhanden ist
   */
  const getResponse = useCallback((questionId: string): unknown => {
    return responseCache.current[questionId];
  }, []);

  return {
    responses: responseCache.current,
    filteredQuestions,
    updateResponse,
    getResponse
  };
}; 