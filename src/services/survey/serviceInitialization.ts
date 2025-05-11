/**
 * Service Initialization
 * ---------------------
 * 
 * This file centralizes the initialization of all survey service singletons.
 * It uses a two-phase initialization pattern to break circular dependencies.
 * 
 * Phase 1: Declare all service instances (empty)
 * Phase 2: Initialize them with dependencies
 */

import SurveyQuestionService from './SurveyQuestionService';
import SurveyResponseService from './SurveyResponseService';
import SurveySessionService from './SurveySessionService';
import { SurveyLifecycleService } from './SurveyLifecycleService';
import SurveyAvailabilityService from './SurveyAvailabilityService';
import SurveyDataService from './SurveyDataService';
import SurveyNavigationService from './SurveyNavigationService';
import SurveyLocationService from './SurveyLocationService';
import { questionRepository } from '../../repositories';
import SurveyAnsweredQuestionsService from './SurveyAnsweredQuestionsService';
import { supabase } from '../../lib/supabase';

// Phase 1: Declare service instances (uninitialized)
// These will be properly initialized in phase 2

// Services without dependencies on other services
export const navigationService = new SurveyNavigationService();
export const lifecycleService = new SurveyLifecycleService();
export const availabilityService = new SurveyAvailabilityService();
export const locationService = new SurveyLocationService();
export const dataService = new SurveyDataService();

// Services that depend on other services
export const questionService = new SurveyQuestionService();
export const responseService = new SurveyResponseService();
export const sessionService = new SurveySessionService();

// Phase 2: Initialize the services that have dependencies
// This happens after all service instances have been declared
export function initializeServices() {
  // Since these function calls happen after the exports above,
  // they can safely reference the already-exported services
  
  // Now we can set any dependencies needed without circular references
  Object.defineProperties(questionService, {
    '_navigationService': { value: navigationService, writable: false },
    '_questionRepo': { value: questionRepository, writable: false },
    '_answeredQuestionsService': { value: SurveyAnsweredQuestionsService, writable: false }
  });
  
  Object.defineProperties(responseService, {
    '_questionService': { value: questionService, writable: false },
    '_questionRepo': { value: questionRepository, writable: false },
    '_answeredQuestionsService': { value: SurveyAnsweredQuestionsService, writable: false },
    '_supabaseClient': { value: supabase, writable: false }
  });
  
  Object.defineProperties(sessionService, {
    '_questionService': { value: questionService, writable: false }
  });
}

// Call the initialization function immediately
initializeServices(); 