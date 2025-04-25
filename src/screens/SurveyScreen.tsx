import React, { useEffect, useRef, useState } from "react";
import { Animated, Keyboard, TouchableWithoutFeedback, View, Dimensions, ScrollView } from "react-native";
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
import { SurveyService, SurveyResponseService, SurveyLocationService } from "../services";
import { Question } from "../types/question";
import { createLogger } from "../utils/logger";
import QuestionImage from "../components/ui/question-image";
import { executeAction } from '../components/QuestionTypes/InfoScreen';
import { LoadingScreen, ErrorScreen } from '../components/screens';

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
const SurveyScreen = ({ navigation }: { navigation: { navigate: (screen: string) => void; goBack: () => void } }) => {
  const { language, t } = useLanguage();
  const [surveyId, setSurveyId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // Store current response for each question
  const responseCache = useRef<Record<string, unknown>>({});
  
  // Track which questions have already been answered at least once
  const answeredQuestions = useRef<Set<string>>(new Set());

  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;

  /**
   * Initializes the survey session and loads questions.
   */
  useEffect(() => {
    const initializeSurvey = async () => {
      try {
        log.info("Initializing survey session...", { language });
        setIsLoading(true);
    
        const { surveyId, questions } = await SurveyService.startSurvey(false, language);
    
        setSurveyId(surveyId);
        setQuestions(questions);
    
        log.info("Survey initialized", { surveyId, questionCount: questions.length });
      } catch (error) {
        log.error("Failed to initialize survey", error);
      } finally {
        setIsLoading(false);
      }
    };    
    initializeSurvey();
  }, [language]);

  /**
   * Callback for receiving responses from question components.
   * This updates the response cache without navigating.
   */
  const handleResponseUpdate = (response: unknown) => {
    if (!questions[currentIndex]) return;
    
    const questionId = questions[currentIndex].id;
    responseCache.current[questionId] = response;
    log.debug("Response updated for question", { questionId, response });
  };

  /**
   * Determines if autoAdvance should be allowed for the current question.
   * Only allows autoAdvance if the question hasn't been answered before.
   */
  const shouldAllowAutoAdvance = (questionId: string): boolean => {
    const hasBeenAnswered = answeredQuestions.current.has(questionId);
    return !hasBeenAnswered;
  };

  /**
   * Animates transitions between questions.
   * @param direction - Direction of transition ('forward' or 'backward')
   * @param nextIndex - The index of the next question to display
   */
  const animateTransition = (direction: "forward" | "backward", nextIndex: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Set initial position based on direction (smaller value for subtler animation)
    slideAnim.setValue(direction === "forward" ? 150 : -150);
    
    // Update index immediately
    setCurrentIndex(nextIndex);
    
    // Very fast animation
    Animated.timing(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      duration: 150,  // Fast animation
    }).start(() => {
      setIsAnimating(false);
    });
  };

  /**
   * Handles moving to the next question and submitting the current response.
   * - If it's the last question, submits the survey.
   * - Otherwise, advances to the next question.
   */
  const handleNext = async () => {
    if (isAnimating) return;
    
    if (!surveyId) {
      log.error("Survey ID is missing, cannot submit response");
      return;
    }

    if (!questions[currentIndex]) {
      log.error("No current question found");
      return;
    }

    const questionId = questions[currentIndex].id;
    const currentQuestion = questions[currentIndex];
    
    try {
      // Get response from cache or use a default value based on question type
      let response = responseCache.current[questionId];
      
      // Für Slider-Fragen: Wenn keine Antwort im Cache ist, setze den Standardwert (0.5)
      if (currentQuestion.type === 'slider' && response === undefined) {
        response = 0.5;
        log.debug("Using default value (0.5) for slider question", { questionId });
      } else if (response === undefined) {
        // Für andere Fragetypen: leeres Objekt wenn keine Antwort
        response = {};
      }
      
      log.debug("Submitting response", { questionId, response, type: currentQuestion.type });
      await SurveyResponseService.submitResponse(surveyId, questionId, response);
      
      // Mark this question as having been answered
      answeredQuestions.current.add(questionId);

      if (currentIndex + 1 < questions.length) {
        log.debug("Moving to next question", { 
          from: currentIndex,
          to: currentIndex + 1,
          nextQuestion: questions[currentIndex + 1].text
        });
        
        const nextIndex = currentIndex + 1;
        const nextQuestion = questions[nextIndex];

        // Attempt to capture location if next question's sequence_number is eligible
        if (nextQuestion && nextQuestion.sequence_number !== undefined && nextQuestion.sequence_number >= 100) {
          log.debug("Attempting to capture location for eligible question", { 
            questionId: nextQuestion.id, 
            sequenceNumber: nextQuestion.sequence_number 
          });
          
          // Try to capture location in background - don't await this to avoid delaying navigation
          SurveyLocationService.captureLocationIfEligible(surveyId, nextQuestion.sequence_number)
            .then(success => {
              log.debug("Location capture result", { success });
            })
            .catch(error => {
              log.error("Error capturing location", error);
            });
        }
        
        animateTransition("forward", nextIndex);
      } else {
        handleComplete();
      }
    } catch (error) {
      log.error("Error submitting response", error);
    }
  };

  /**
   * Auto-advance callback for single-choice questions.
   * Only triggers if the question hasn't been answered before.
   */
  const handleAutoAdvance = () => {
    const questionId = questions[currentIndex]?.id;
    if (!questionId) return;
    
    // Check if this question should allow auto-advance
    if (shouldAllowAutoAdvance(questionId)) {
      log.debug("Auto-advance triggered for first-time answer", { questionId });
      handleNext();
    } else {
      log.debug("Auto-advance skipped for previously answered question", { questionId });
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
      // On first question, check if we have any answers
      const hasAnswers = answeredQuestions.current.size > 0;
      
      if (hasAnswers) {
        // Show confirmation dialog if answers exist
        log.debug("Showing exit confirmation dialog");
        setShowExitDialog(true);
      } else {
        // Exit directly if no answers
        log.info("Exiting survey with no answers");
        navigation.goBack();
      }
    } else {
      log.debug("Moving to previous question", {
        from: currentIndex,
        to: currentIndex - 1,
        prevQuestion: questions[currentIndex - 1].text
      });
      
      const prevIndex = currentIndex - 1;
      animateTransition("backward", prevIndex);
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
    if (surveyId) {
      // Verhindere doppeltes Abschließen der Umfrage
      if (isLoading) {
        log.warn("Ignoring duplicate survey completion attempt");
        return;
      }
      
      setIsLoading(true);
      log.info("Survey completed");
      log.info("Completing survey", { surveyId });
      
      // Convert the set of answered question IDs to an array of Question objects
      const allAnsweredQuestions = Array.from(answeredQuestions.current).map(qId => 
        questions.find(q => q.id === qId)
      ).filter(Boolean) as Question[];
      
      log.debug("Submitting answered questions to service", { count: allAnsweredQuestions.length });
      try {
        await SurveyService.completeSurvey(surveyId, allAnsweredQuestions);
        // Navigiere nach erfolgreicher Übermittlung zurück
        navigation.navigate("Home");
      } catch (error) {
        log.error("Failed to complete survey", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Keine gültige Umfrage-ID
      log.error("Cannot complete survey, no valid survey ID");
      navigation.navigate("Home");
    }
  };

  // Show loading screen while survey questions are being fetched
  if (isLoading) {
    return (
      <LoadingScreen 
        title={t('survey.loading') || 'Loading survey...'}
        description={t('survey.loadingDescription') || 'Please wait while we prepare your survey questions.'}
      />
    );
  }

  // Show error screen if no questions are available
  if (questions.length === 0) {
    return (
      <ErrorScreen
        title={t('survey.noQuestions') || 'No questions available.'}
        description={t('survey.noQuestionsDescription') || 'There was a problem loading the survey questions. Please try again later.'}
        buttonText={t('survey.returnHome') || 'Return to Home'}
        onAction={() => navigation.goBack()}
      />
    );
  }

  const currentQuestion = questions[currentIndex];
  const questionId = currentQuestion.id;
  const previousResponse = responseCache.current[questionId];
  const isPreviouslyAnswered = answeredQuestions.current.has(questionId);

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
    previouslyAnswered: isPreviouslyAnswered,
    hasPreviousResponse: !!previousResponse
  });

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <View className="flex-1">
        <View className="flex-1">
          {/* Question Content - Only this part is animated */}
          <Animated.View 
            style={{ flex: 1, transform: [{ translateX: slideAnim }] }}
          >
            <ScrollView
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
                    {currentQuestion.type === "info_screen" ? (
                      <QuestionRenderer 
                        question={currentQuestion} 
                        onNext={handleResponseUpdate} 
                        onAutoAdvance={handleAutoAdvance}
                        initialValue={previousResponse}
                      />
                    ) : (
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
                {currentQuestion.type !== "info_screen" && (
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
                  if (isAnimating) return;

                  log.info("Next/Submit button clicked", {
                    questionType: currentQuestion.type,
                    hasAction: currentQuestion.type === "info_screen" && !!currentQuestion.options?.action,
                    action: currentQuestion.type === "info_screen" ? currentQuestion.options?.action : null
                  });

                  setIsAnimating(true);
                  try {
                    if (currentQuestion.type === "info_screen" && currentQuestion.options?.action) {
                      const action = currentQuestion.options.action as 'request_notification_permission' | 'request_location_permission';
                      log.info(`Executing InfoScreen action: ${action}`);
                      const success = await executeAction(action);
                      log.info(`Action ${action} executed with result: ${success}`);
                      await new Promise(resolve => setTimeout(resolve, 500));
                    }

                    if (currentQuestion.type === "info_screen") {
                      handleResponseUpdate(undefined);
                    }

                    await handleNext();
                  } catch (error) {
                    log.error("Error in Next button handler:", error);
                    await handleNext(); // trotzdem weiter
                  } finally {
                    setIsAnimating(false);
                  }
                }}
                disabled={isAnimating}
              >
                <Text className="text-primary">
                  {currentIndex === questions.length - 1 
                    ? t('survey.submit')
                    : currentQuestion.type === "info_screen" && currentQuestion.buttonText 
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
