/**
 * @packageDocumentation
 * @module Hooks
 * 
 * @summary
 * Hook zur Verwaltung der Navigation in Umfragen
 */

import { useState, useCallback, useRef } from 'react';
import { Question } from '../types/question';
import { navigationService, questionService } from '../services/survey';
import { createLogger } from '../utils/logger';

const log = createLogger("useSurveyNavigation");

/**
 * Hook zur Verwaltung der Navigation in Umfragen
 * 
 * Verwendet SurveyNavigationService für die Navigation zwischen Fragen und
 * kümmert sich um die Aktualisierung des Index bei Änderungen der Fragenliste
 * aufgrund von bedingter Logik.
 * 
 * @param initialQuestions Die initiale Liste von Fragen
 * @returns Navigationszustand und -methoden
 */
export function useSurveyNavigation(initialQuestions: Question[]) {
  // Fragen
  const [allQuestions, setAllQuestions] = useState<Question[]>(initialQuestions);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(initialQuestions);
  
  // Navigation
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Beantwortete Fragen (Set für schnellen Zugriff)
  const answeredQuestions = useRef<Set<string>>(new Set());
  
  /**
   * Aktualisiert die Fragenliste und passt den Index entsprechend an
   */
  const updateQuestions = useCallback((newAllQuestions: Question[], newFilteredQuestions: Question[]) => {
    // Aktuelle Frage speichern, um sie später wiederzufinden
    const currentQuestion = filteredQuestions[currentIndex];
    
    // Aktualisiere die Fragenlisten
    setAllQuestions(newAllQuestions);
    setFilteredQuestions(newFilteredQuestions);
    
    // Berechne neuen Index basierend auf der gefilterten Liste
    const newIndex = navigationService.handleFilteredQuestionsUpdate(
      allQuestions,
      newFilteredQuestions,
      currentIndex,
      currentQuestion
    );
    
    // Index aktualisieren, wenn er sich geändert hat
    if (newIndex !== currentIndex) {
      log.debug("Updating index after question list change", {
        oldIndex: currentIndex,
        newIndex,
        oldQuestionId: currentQuestion?.id,
        newQuestionId: newFilteredQuestions[newIndex]?.id
      });
      setCurrentIndex(newIndex);
    }
  }, [allQuestions, currentIndex, filteredQuestions]);
  
  /**
   * Navigiert zur nächsten Frage
   */
  const navigateNext = useCallback(() => {
    if (isAnimating || filteredQuestions.length === 0) return false;
    
    const nextIndex = navigationService.calculateNextIndex(currentIndex, filteredQuestions);
    
    if (nextIndex === -1) {
      // Keine weitere Frage verfügbar
      log.debug("No next question available, at the end of survey");
      return false;
    }
    
    // Index aktualisieren
    setIsAnimating(true);
    setCurrentIndex(nextIndex);
    
    log.debug("Navigated to next question", {
      from: currentIndex,
      to: nextIndex,
      questionId: filteredQuestions[nextIndex]?.id
    });
    
    // Signalisiere erfolgreiche Navigation
    return true;
  }, [currentIndex, filteredQuestions, isAnimating]);
  
  /**
   * Navigiert zur vorherigen Frage
   */
  const navigateBack = useCallback(() => {
    if (isAnimating || filteredQuestions.length === 0) return false;
    
    const prevIndex = navigationService.calculatePreviousIndex(currentIndex, filteredQuestions);
    
    if (prevIndex === -1) {
      // Keine vorherige Frage verfügbar
      log.debug("No previous question available, at the beginning of survey");
      return false;
    }
    
    // Index aktualisieren
    setIsAnimating(true);
    setCurrentIndex(prevIndex);
    
    log.debug("Navigated to previous question", {
      from: currentIndex,
      to: prevIndex,
      questionId: filteredQuestions[prevIndex]?.id
    });
    
    // Signalisiere erfolgreiche Navigation
    return true;
  }, [currentIndex, filteredQuestions, isAnimating]);
  
  /**
   * Prüft, ob die Umfrage nach der aktuellen Frage beendet werden sollte
   */
  const shouldCompleteSurvey = useCallback(() => {
    return navigationService.shouldCompleteOnNext(currentIndex, filteredQuestions);
  }, [currentIndex, filteredQuestions]);
  
  /**
   * Markiert eine Frage als beantwortet
   */
  const markQuestionAsAnswered = useCallback((questionId: string) => {
    // Füge die Frage zur Set der beantworteten Fragen hinzu
    answeredQuestions.current.add(questionId);
  }, []);
  
  /**
   * Beendet die Animation
   */
  const finishAnimation = useCallback(() => {
    setIsAnimating(false);
  }, []);
  
  // Aktuelle Frage
  const currentQuestion = filteredQuestions[currentIndex];
  
  return {
    // Zustand
    allQuestions,
    filteredQuestions,
    currentIndex,
    currentQuestion,
    isAnimating,
    
    // Hilfsmethoden
    isQuestionAnswered: (questionId: string) => answeredQuestions.current.has(questionId),
    
    // Aktionen
    updateQuestions,
    navigateNext,
    navigateBack,
    shouldCompleteSurvey,
    markQuestionAsAnswered,
    finishAnimation,
    
    // Rohe Set-Methoden
    setCurrentIndex
  };
} 