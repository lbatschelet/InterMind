import React, { useEffect, useState } from "react";
import { View, Animated, Keyboard, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SurveyService from "../services/SurveyService";
import ResponseService from "../services/ResponseService";
import QuestionRenderer from "../components/QuestionRenderer";
import { Button } from "../components/ui/button";
import { Text } from "../components/ui/text";
import { log } from "../utils/logger";
import { Question } from "../types/question";

/**
 * SurveyScreen handles the full survey flow.
 * - Loads questions dynamically from `SurveyService`.
 * - Manages navigation between questions.
 * - Submits responses to the database.
 * - Uses smooth animations for transitions.
 */
const SurveyScreen = ({ navigation }: { navigation: any }) => {
  const [surveyId, setSurveyId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Animation for transitions
  const slideAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(1);

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
        setQuestions(questions.questions); // ✅ Extract only the questions array
    
        log.info("Survey initialized", { surveyId, questions: questions.questions });
      } catch (error) {
        log.error("Failed to initialize survey", error);
      } finally {
        setIsLoading(false);
      }
    };    
    initializeSurvey();
  }, []);

  /**
   * Handles moving to the next question.
   * - If it's the last question, submits the survey.
   * - Otherwise, advances to the next question.
   */
  const handleNext = async (response: any) => {
    if (!surveyId) {
      log.error("Survey ID is missing, cannot submit response");
      return;
    }

    const currentQuestion = questions[currentIndex];

    try {
      log.debug("Submitting response", { questionId: currentQuestion.id, response });
      await ResponseService.submitResponse(surveyId, currentQuestion.id, response);

      if (currentIndex + 1 < questions.length) {
        animateTransition("forward");
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
   * Handles moving back to the previous question.
   * - If it's the first question, exits the survey.
   * - Otherwise, moves back to the previous question.
   */
  const handleBack = () => {
    if (currentIndex === 0) {
      log.info("Exiting survey");
      navigation.goBack();
    } else {
      animateTransition("backward");
      setCurrentIndex(currentIndex - 1);
    }
  };

  /**
   * Animates transitions between questions.
   * @param direction - Direction of transition ('forward' or 'backward')
   */
  const animateTransition = (direction: "forward" | "backward") => {
    slideAnim.setValue(direction === "forward" ? 100 : -100);
    fadeAnim.setValue(0);

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
        velocity: direction === "forward" ? 2 : -2,
      }),
      Animated.sequence([
        Animated.delay(100),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
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

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1 bg-background">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Animated.View
          className="flex-1 px-4"
          style={{ transform: [{ translateX: slideAnim }], opacity: fadeAnim }}
        >
          <View className="flex-1 justify-center items-center">
            <View className="w-full max-w-md">
              <Text className="text-2xl font-bold mb-8 text-center">{currentQuestion.text}</Text>
              <QuestionRenderer question={currentQuestion} onNext={handleNext} />
            </View>
          </View>

          {/* Navigation Buttons */}
          <View className="flex-row justify-between items-center w-full py-4">
            <Button variant="outline" onPress={handleBack} className={currentIndex === 0 ? "opacity-50" : ""}>
              <Text>Back</Text>
            </Button>

            <Button variant="default" className="bg-accent" onPress={() => handleNext(null)}>
              <Text className="text-primary">
                {currentIndex === questions.length - 1 ? "Submit" : "Next"}
              </Text>
            </Button>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SurveyScreen;
