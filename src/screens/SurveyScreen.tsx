import React, { useEffect, useRef, useState } from "react";
import { Animated, View, Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuestionRenderer from "../components/QuestionRenderer";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { Text } from "../components/ui/text";
import { useLanguage } from "../contexts/LanguageContext";
import { SurveyService, locationService } from "../services";
import { Question } from "../types/question";
import { createLogger } from "../utils/logger";
import QuestionImage from "../components/ui/question-image";
import { executeAction } from '../components/QuestionTypes/InfoScreen';
import { ErrorScreen } from '../screens';
import LoadingScreen from '../screens/LoadingScreen';
import { useSurveyNavigation, useSurveyResponses } from '../hooks';

// Initialize logger for this module
const log = createLogger("SurveyScreen");

// Screen dimensions for responsive design
const { width, height } = Dimensions.get('window');

/**
 * SurveyScreen handles the full survey flow.
 * - Loads questions dynamically from `SurveyService`.
 * - Manages navigation between questions.
 * - Submits responses to the database.
 * - Provides smooth transitions between questions.
 */
const SurveyScreen = ({ navigation, route }: { 
  navigation: { navigate: (screen: string) => void; goBack: () => void },
  route: { params?: { surveyId: string; questions: Question[] } }
}) => {
  const { language, t } = useLanguage();
  const [surveyId, setSurveyId] = useState<string | null>(route.params?.surveyId || null);
  const [allQuestions, setAllQuestions] = useState<Question[]>(route.params?.questions || []);
  const [isLoading, setIsLoading] = useState(!route.params);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Refs for both ScrollViews to reset scroll position
  const outerScrollViewRef = useRef<ScrollView>(null);
  const questionScrollViewRef = useRef<ScrollView>(null);

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Custom hooks für Navigation und Antworten
  const {
    filteredQuestions,
    currentIndex,
    currentQuestion,
    isAnimating,
    isQuestionAnswered,
    navigateNext,
    navigateBack,
    shouldCompleteSurvey,
    markQuestionAsAnswered,
    finishAnimation,
    updateQuestions
  } = useSurveyNavigation(allQuestions);

  const {
    responses,
    updateResponse,
    getResponse
  } = useSurveyResponses(surveyId || '', allQuestions);

  // Track if survey has been initialized to prevent infinite loops
  const surveyInitializedRef = useRef(false);
  
  // Track which responses have been processed to prevent loops
  const processedResponses = useRef(new Set<string>()).current;
  
  // Track button clicks to prevent multiple rapid clicks
  const isProcessingButtonClick = useRef(false);

  // Log debug information only when currentQuestion changes, not on every render
  useEffect(() => {
    if (currentQuestion) {
      // Debug-Logs für Button-Text
      if (currentQuestion.type === 'info_screen' && currentQuestion.buttonText) {
        log.debug("Button Text Debug", { 
          buttonText: currentQuestion.buttonText, 
          type: typeof currentQuestion.buttonText,
          isString: typeof currentQuestion.buttonText === 'string',
          startsWithGeneral: typeof currentQuestion.buttonText === 'string' && currentQuestion.buttonText.startsWith('general.'),
          translation: typeof currentQuestion.buttonText === 'string' && currentQuestion.buttonText.startsWith('general.') ? t(currentQuestion.buttonText) : 'n/a'
        });
      }

      log.debug("Current question state", { 
        index: currentIndex, 
        type: currentQuestion.type,
        previouslyAnswered: isQuestionAnswered(currentQuestion.id),
        hasPreviousResponse: !!getResponse(currentQuestion.id)
      });
    }
  }, [currentQuestion, currentIndex, t, isQuestionAnswered, getResponse]);

  /**
   * Initializes the survey session and loads questions.
   */
  useEffect(() => {
    const initializeSurvey = async () => {
      // If we have survey params, use them instead of creating a new survey
      if (route.params?.surveyId && route.params?.questions) {
        // Survey data was passed via navigation, use it
        log.info("Using provided survey data", { 
          surveyId: route.params.surveyId, 
          questionCount: route.params.questions.length 
        });
        
        setSurveyId(route.params.surveyId);
        setAllQuestions(route.params.questions);
        updateQuestions(route.params.questions, route.params.questions);
        
        // Mark survey as initialized
        surveyInitializedRef.current = true;
        setIsLoading(false);
        
        return;
      }
      
      // Skip initialization if survey is already initialized
      if (surveyInitializedRef.current) {
        log.debug("Survey already initialized, skipping re-initialization");
        return;
      }

      try {
        log.info("Initializing survey session...", { language });
        setIsLoading(true);
        
        const { surveyId, questions } = await SurveyService.startSurvey(false, language);
        
        setSurveyId(surveyId);
        setAllQuestions(questions);
        
        // Aktualisieren der gefilterten Fragen
        updateQuestions(questions, questions);
        
        // Mark survey as initialized to prevent re-initialization
        surveyInitializedRef.current = true;
        
        log.info("Survey initialized", { surveyId, questionCount: questions.length });
      } catch (error) {
        log.error("Failed to initialize survey", error);
      } finally {
        setIsLoading(false);
      }
    };    
    initializeSurvey();
  }, [language, updateQuestions, route.params]);

  /**
   * Callback for receiving responses from question components.
   * This updates the response cache and handles conditional logic.
   */
  const handleResponseUpdate = async (response: unknown) => {
    if (!currentQuestion) return;
    
    const questionId = currentQuestion.id;
    
    // Create a unique key for this response to avoid processing the same response multiple times
    const responseKey = `${questionId}-${JSON.stringify(response)}`;
    
    // Skip if we've already processed this exact response
    if (processedResponses.has(responseKey)) {
      log.debug("Skipping already processed response", { questionId });
      return;
    }
    
    // Add to processed set
    processedResponses.add(responseKey);
    
    try {
      // Speichere die Antwort und wende bedingte Logik an
      const filteredQuestions = await updateResponse(questionId, response);
      
      // Aktualisiere die gefilterte Fragenliste
      updateQuestions(allQuestions, filteredQuestions);
      
      log.debug("Response updated for question", { questionId, response });
    } catch (error) {
      log.error("Error updating response", error);
    }
  };

  /**
   * Determines if autoAdvance should be allowed for the current question.
   * Only allows autoAdvance if the question hasn't been answered before.
   */
  const shouldAllowAutoAdvance = (questionId: string): boolean => {
    return !isQuestionAnswered(questionId);
  };

  /**
   * Animates transitions between questions.
   * @param direction - Direction of transition ('forward' or 'backward')
   * @param nextIndex - The index of the next question to display
   */
  const animateTransition = (direction: "forward" | "backward") => {
    // Set initial position based on direction (smaller value for subtler animation)
    slideAnim.setValue(direction === "forward" ? 150 : -150);
    
    // Reset scroll positions for both ScrollViews
    outerScrollViewRef.current?.scrollTo({ y: 0, animated: false });
    questionScrollViewRef.current?.scrollTo({ y: 0, animated: false });
    
    // Very fast animation
    Animated.timing(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      duration: 150,  // Fast animation
    }).start(() => {
      finishAnimation();
    });
  };

  /**
   * Handles moving to the next question and submitting the current response.
   * - If it's the last question, submits the survey.
   * - Otherwise, advances to the next question.
   */
  const handleNext = async () => {
    if (isAnimating || !surveyId || !currentQuestion) return;
    
    // Markiere die aktuelle Frage als beantwortet
    markQuestionAsAnswered(currentQuestion.id);
    
    // Prüfen, ob die Umfrage abgeschlossen werden sollte
    if (shouldCompleteSurvey()) {
      await handleComplete();
      return;
    }
    
    // Navigation zur nächsten Frage
    if (navigateNext()) {
      // Try to capture location if appropriate
      if (currentQuestion.sequence_number !== undefined && currentQuestion.sequence_number >= 100) {
        // Background capture without awaiting
        locationService.captureLocationIfEligible(surveyId, currentQuestion.sequence_number)
          .then((success: boolean) => log.debug("Location capture result", { success }))
          .catch((error: Error) => log.error("Error capturing location", error));
      }
      
      animateTransition("forward");
    }
  };

  /**
   * Auto-advance callback for single-choice questions.
   * Only triggers if the question hasn't been answered before.
   */
  const handleAutoAdvance = () => {
    if (!currentQuestion) return;
    
    // Check if this question should allow auto-advance
    if (shouldAllowAutoAdvance(currentQuestion.id)) {
      log.debug("Auto-advance triggered for first-time answer", { questionId: currentQuestion.id });
      handleNext();
    } else {
      log.debug("Auto-advance skipped for previously answered question", { questionId: currentQuestion.id });
    }
  };

  /**
   * Handles moving back to the previous question.
   * - If it's the first question, shows exit confirmation if answers exist.
   * - Otherwise, moves back to the previous question.
   */
  const handleBack = () => {
    if (isAnimating) return;
    
    if (currentIndex === 0) {
      // On first question, check if we have any answered questions
      if (Object.keys(responses).length > 0) {
        // Show confirmation dialog if answers exist
        log.debug("Showing exit confirmation dialog");
        setShowExitDialog(true);
      } else {
        // Exit directly if no answers
        log.info("Exiting survey with no answers");
        navigation.goBack();
      }
    } else {
      // Navigate back
      if (navigateBack()) {
        animateTransition("backward");
      }
    }
  };

  /**
   * Confirms exit from the survey.
   */
  const confirmExit = () => {
    log.info("User confirmed exit from survey");
    setShowExitDialog(false);
    navigation.goBack();
  };

  /**
   * Cancels exit from the survey.
   */
  const cancelExit = () => {
    log.debug("User canceled exit from survey");
    setShowExitDialog(false);
  };

  /**
   * Handles survey completion and navigates back to home.
   */
  const handleComplete = async () => {
    if (!surveyId) {
      log.error("Cannot complete survey, no valid survey ID");
      navigation.navigate("Home");
      return;
    }
    
    // Verhindere doppeltes Abschließen der Umfrage
    if (isLoading) {
      log.warn("Ignoring duplicate survey completion attempt");
      return;
    }
    
    setIsLoading(true);
    log.info("Survey completed");
    log.info("Completing survey", { surveyId });
    
    // Get the list of answered question IDs from responses
    const answeredQuestionIds = Object.keys(responses);
    
    // Convert to actual Question objects
    const answeredQuestions = answeredQuestionIds
      .map(id => allQuestions.find(q => q.id === id))
      .filter((q): q is Question => q !== undefined);
    
    log.debug("Submitting answered questions to service", { count: answeredQuestions.length });
    
    try {
      await SurveyService.completeSurvey(surveyId, answeredQuestions);
      // Navigiere nach erfolgreicher Übermittlung zurück
      navigation.navigate("Home");
    } catch (error) {
      log.error("Failed to complete survey", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen while survey questions are being fetched
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show error screen if no questions are available
  if (filteredQuestions.length === 0) {
    return (
      <ErrorScreen
        title={t('survey.noQuestions') || 'No questions available.'}
        description={t('survey.noQuestionsDescription') || 'There was a problem loading the survey questions. Please try again later.'}
        buttonText={t('survey.returnHome') || 'Return to Home'}
        onAction={() => navigation.goBack()}
      />
    );
  }

  // Get current response from cache
  const previousResponse = currentQuestion ? getResponse(currentQuestion.id) : undefined;
  const isPreviouslyAnswered = currentQuestion ? isQuestionAnswered(currentQuestion.id) : false;

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <View className="flex-1">
        <View className="flex-1">
          {/* Question Content - Only this part is animated */}
          <Animated.View 
            style={{ flex: 1, transform: [{ translateX: slideAnim }] }}
          >
            <ScrollView
              ref={outerScrollViewRef}
              contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16, flexGrow: 1 }}
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
            >
              <View className="flex-1 flex-col justify-between">
                {/* Oberhalb der Frage und Antworten: flexibler Abstand */}
                <View className="flex-grow" />
                
                {/* Mittlerer Bereich: Frage */}
                <View>
                  <ScrollView
                    ref={questionScrollViewRef}
                    className="w-full"
                    contentContainerStyle={{
                      paddingVertical: 8, 
                    }}
                    showsVerticalScrollIndicator={true}
                    bounces={true}
                    alwaysBounceVertical={true}
                    scrollEventThrottle={16}
                    decelerationRate="normal"
                  >
                    {currentQuestion && currentQuestion.type === "info_screen" ? (
                      <QuestionRenderer 
                        question={currentQuestion} 
                        onNext={handleResponseUpdate} 
                        onAutoAdvance={handleAutoAdvance}
                        initialValue={previousResponse}
                      />
                    ) : currentQuestion && (
                      <View className="items-center">
                        {/* Bild zuerst, wenn vorhanden */}
                        {currentQuestion.imageSource && (
                          <View className="w-full items-center mb-4">
                            <QuestionImage imageSource={currentQuestion.imageSource} />
                          </View>
                        )}
                        
                        <Text className="text-2xl font-bold text-center">
                          {currentQuestion.text}
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
                
                {/* Minimaler Abstand zwischen Frage und Antworten */}
                <View className="h-4" />
                
                {/* Antwortmöglichkeiten (nur für Nicht-InfoScreen-Typen) */}
                {currentQuestion && currentQuestion.type !== "info_screen" && (
                  <View className="w-full">
                    <QuestionRenderer 
                      question={currentQuestion} 
                      onNext={handleResponseUpdate} 
                      onAutoAdvance={handleAutoAdvance}
                      initialValue={previousResponse}
                    />
                  </View>
                )}
                
                {/* Unterhalb der Antworten: flexibler Abstand */}
                <View className="flex-grow" />
              </View>
            </ScrollView>
          </Animated.View>

          {/* Navigation Buttons - Not animated */}
          {/* Fixierter Footer mit weißem Hintergrund */}
          <View className="border-t border-muted bg-background px-6 py-4">
            <View className="flex-row justify-between items-center">
              <Button 
                variant="outline" 
                onPress={handleBack} 
                className={currentIndex === 0 ? "opacity-50" : ""}
                disabled={isAnimating}
              >
                <Text>{t('survey.back')}</Text>
              </Button>

              <Button 
                variant="default" 
                className="bg-accent" 
                onPress={async () => {
                  if (isAnimating || !currentQuestion || isProcessingButtonClick.current) return;

                  // Mark as processing to prevent multiple clicks
                  isProcessingButtonClick.current = true;
                  
                  try {
                    log.info("Next/Submit button clicked", {
                      questionType: currentQuestion.type,
                      hasAction: currentQuestion.type === "info_screen" && !!currentQuestion.options?.action,
                      action: currentQuestion.type === "info_screen" ? currentQuestion.options?.action : null
                    });

                    if (currentQuestion.type === "info_screen" && currentQuestion.options?.action) {
                      const action = currentQuestion.options.action as 'request_notification_permission' | 'request_location_permission';
                      log.info(`Executing InfoScreen action: ${action}`);
                      const success = await executeAction(action);
                      log.info(`Action ${action} executed with result: ${success}`);
                      await new Promise(resolve => setTimeout(resolve, 500));
                    }

                    if (currentQuestion.type === "info_screen") {
                      await handleResponseUpdate(undefined);
                    }

                    await handleNext();
                  } catch (error) {
                    log.error("Error processing button click", error);
                  } finally {
                    // Reset processing flag after a delay to prevent rapid re-clicks
                    setTimeout(() => {
                      isProcessingButtonClick.current = false;
                    }, 500);
                  }
                }}
                disabled={isAnimating}
              >
                <Text className="text-primary">
                  {currentIndex === filteredQuestions.length - 1 
                    ? t('survey.submit')
                    : currentQuestion && currentQuestion.type === "info_screen" && currentQuestion.buttonText 
                      ? (typeof currentQuestion.buttonText === 'string')
                        ? (currentQuestion.buttonText.startsWith('survey.') || currentQuestion.buttonText.startsWith('general.'))
                          ? t(currentQuestion.buttonText) 
                          : currentQuestion.buttonText
                        : (typeof currentQuestion.buttonText === 'object' && currentQuestion.buttonText)
                          ? currentQuestion.buttonText[language] || t('survey.next')
                          : t('survey.next')
                      : t('survey.next')}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </View>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent portalHost="root-portal">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('survey.exitTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('survey.exitMessage')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onPress={cancelExit}>
              <Text>{t('survey.continueSurvey')}</Text>
            </AlertDialogCancel>
            <AlertDialogAction className="bg-destructive" onPress={confirmExit}>
              <Text className="text-destructive-foreground">{t('survey.exitSurvey')}</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SafeAreaView>
  );
};

export default SurveyScreen;
