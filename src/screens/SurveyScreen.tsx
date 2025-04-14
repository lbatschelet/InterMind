import React, { useEffect, useRef, useState } from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QuestionRenderer from "../components/QuestionRenderer";
import { Button } from "../components/ui/button";
import { Text } from "../components/ui/text";
import ResponseService from "../services/ResponseService";
import SurveyService from "../services/SurveyService";
import { Question } from "../types/question";
import { createLogger } from "../utils/logger";

// Initialize logger for this module
const log = createLogger("SurveyScreen");

/**
 * SurveyScreen handles the full survey flow.
 * - Loads questions dynamically from `SurveyService`.
 * - Manages navigation between questions.
 * - Submits responses to the database.
 */
const SurveyScreen = ({ navigation }: { navigation: { navigate: (screen: string) => void; goBack: () => void } }) => {
  const [surveyId, setSurveyId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Store current response for each question
  const responseCache = useRef<Record<string, unknown>>({});

  /**
   * Initializes the survey session and loads questions.
   */
  useEffect(() => {
    const initializeSurvey = async () => {
      try {
        log.info("Initializing survey session...");
        setIsLoading(true);
    
        const { surveyId, questions } = await SurveyService.startSurvey();
    
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
  }, []);

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
   * Handles moving to the next question and submitting the current response.
   * - If it's the last question, submits the survey.
   * - Otherwise, advances to the next question.
   */
  const handleNext = async () => {
    if (!surveyId) {
      log.error("Survey ID is missing, cannot submit response");
      return;
    }

    if (!questions[currentIndex]) {
      log.error("No current question found");
      return;
    }

    const questionId = questions[currentIndex].id;
    
    try {
      // Get response from cache or use empty object
      const response = responseCache.current[questionId] || {};
      
      log.debug("Submitting response", { questionId, response });
      await ResponseService.submitResponse(surveyId, questionId, response);

      if (currentIndex + 1 < questions.length) {
        log.debug("Moving to next question", { 
          from: currentIndex,
          to: currentIndex + 1,
          nextQuestion: questions[currentIndex + 1].text
        });
        
        // Simply update the index - no animation
        setCurrentIndex(currentIndex + 1);
      } else {
        log.info("Survey completed");
        handleComplete();
      }
    } catch (error) {
      log.error("Error submitting response", error);
    }
  };

  /**
   * Auto-advance callback for single-choice questions.
   */
  const handleAutoAdvance = () => {
    log.debug("Auto-advance triggered");
    handleNext();
  };

  /**
   * Handles moving back to the previous question.
   * - If it's the first question, exits the survey.
   * - Otherwise, moves back to the previous question.
   */
  const handleBack = () => {
    if (currentIndex === 0) {
      log.info("Exiting survey");
      navigation.goBack();
    } else {
      log.debug("Moving to previous question", {
        from: currentIndex,
        to: currentIndex - 1,
        prevQuestion: questions[currentIndex - 1].text
      });
      
      // Simply update the index - no animation
      setCurrentIndex(currentIndex - 1);
    }
  };

  /**
   * Handles survey completion and navigates back to home.
   */
  const handleComplete = async () => {
    if (surveyId) {
      log.info("Completing survey", { surveyId });
      await SurveyService.completeSurvey(surveyId);
    }
    navigation.navigate("Home");
  };

  if (isLoading) return <Text>Loading survey...</Text>;
  if (questions.length === 0) return <Text>No questions available.</Text>;

  const currentQuestion = questions[currentIndex];

  log.debug("Current question", { index: currentIndex, type: currentQuestion.type });

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-background">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 px-4">
          <View className="flex-1 justify-center items-center">
            <View className="w-full max-w-md">
              <Text className="text-2xl font-bold mb-8 text-center">{currentQuestion.text}</Text>
              <QuestionRenderer 
                question={currentQuestion} 
                onNext={handleResponseUpdate} 
                onAutoAdvance={handleAutoAdvance}
              />
            </View>
          </View>

          {/* Navigation Buttons */}
          <View className="flex-row justify-between items-center w-full py-4">
            <Button variant="outline" onPress={handleBack} className={currentIndex === 0 ? "opacity-50" : ""}>
              <Text>Back</Text>
            </Button>

            {/* Next/Submit Button for all question types */}
            <Button variant="default" className="bg-accent" onPress={handleNext}>
              <Text className="text-primary">
                {currentIndex === questions.length - 1 ? "Submit" : "Next"}
              </Text>
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SurveyScreen;
