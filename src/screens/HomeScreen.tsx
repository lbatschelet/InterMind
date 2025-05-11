import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Dimensions, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgRegistry } from "~/src/lib/images";
import { Button } from "~/src/components/ui/button";
import { Text } from "~/src/components/ui/text";
import { useLanguage } from "~/src/contexts/LanguageContext";
import { RootStackParamList } from "~/src/navigation/AppNavigator";
import { createLogger } from "~/src/utils/logger";
import { formatSurveyTime } from "~/src/utils/formatSurveyTime";
import { useSurveyAvailability } from "~/src/hooks/useSurveyAvailability";
import { useCompletedSurveys } from "~/src/hooks/useCompletedSurveys";
import LoadingScreen from "~/src/screens/LoadingScreen";
import ErrorScreen from "~/src/screens/ErrorScreen";

const log = createLogger("HomeScreen");

/** Screen width for responsive display */
const { width } = Dimensions.get("window");

/** Navigation prop type for the Home screen */
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

/** Props for the Home screen component */
interface HomeScreenProps {
  /** Navigation object from React Navigation */
  navigation: HomeScreenNavigationProp;
}

/**
 * Home Screen Component
 *
 * @param navigation - Navigation object for screen transitions
 *
 * @remarks
 * Main entry point of the application with:
 * - Display of a welcoming illustration
 * - Start button for new survey
 * - Prevention of double submissions
 *
 * @example
 * ```tsx
 * <HomeScreen navigation={navigation} />
 * ```
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { t, language } = useLanguage();
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  
  // Use the survey availability hook
  const { isAvailable, nextTime, startSurvey, isCreatingSurvey } = useSurveyAvailability();
  
  // Use the completed surveys hook to check if all slots are done
  const areAllSlotsCompleted = useCompletedSurveys();
  
  // Get the SVG component from the registry
  const HomeIllustration = SvgRegistry["a-day-at-the-park"];

  // If all slots are completed, navigate to the thank you screen
  useEffect(() => {
    if (areAllSlotsCompleted) {
      log.info("All survey slots are completed or missed, navigating to thank you screen");
      navigation.replace("ThankYou");
    }
  }, [areAllSlotsCompleted, navigation]);

  /**
   * Handles the start survey button press
   * Attempts to start a survey and navigates to the survey screen if successful
   */
  const handleStartSurvey = async () => {
    // Don't allow starting survey if already creating one
    if (isCreatingSurvey) return;
    
    setConnectionError(null);
    
    try {
      log.info("Starting a new survey session...");
      const surveyData = await startSurvey(language);
      
      if (surveyData) {
        log.info("Survey session started, navigating to survey screen", {
          surveyId: surveyData.surveyId,
          questionCount: surveyData.questions.length
        });
        
        // Pass survey data as navigation parameters
        navigation.navigate("SurveyScreen", {
          surveyId: surveyData.surveyId,
          questions: surveyData.questions
        });
      } else {
        // Wenn startSurvey false zurückgibt, aber keinen Fehler wirft,
        // wurde wahrscheinlich keine Verbindung hergestellt
        log.error("Failed to start survey but no error was thrown");
        setConnectionError(new Error("Could not connect to the server"));
      }
    } catch (error) {
      log.error("Error starting survey:", error);
      setConnectionError(error instanceof Error ? error : new Error("Unknown error occurred"));
    }
  };

  // Handle connection error retry
  const handleRetry = () => {
    setConnectionError(null);
    // Leichte Verzögerung vor neuem Versuch
    setTimeout(() => {
      handleStartSurvey();
    }, 500);
  };

  // Handle going back to home without retry
  const handleGoBack = () => {
    setConnectionError(null);
  };

  // If connection error occurred, show error screen
  if (connectionError) {
    return (
      <ErrorScreen
        title={t('errors.connectionError') || 'Connection Failed'}
        description={t('errors.connectionErrorMessage') || 'Could not connect to the database. Please check your internet connection and try again.'}
        buttonText={t('general.goBack')}
        imageKey="page-not-found"
        onAction={handleGoBack}
      />
    );
  }

  // If creating a survey, show the loader instead of the main UI
  if (isCreatingSurvey) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <SafeAreaView edges={["top"]} className="flex-1">
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

        {/* Centered SVG */}
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <HomeIllustration width={width * 0.8} height={width * 0.8} />
        </View>

        {/* Survey Button */}
        <View className="w-full px-4 mb-12 items-center">
          <Button 
            variant="default" 
            className={isAvailable ? "bg-accent w-full" : "bg-muted w-full"}
            disabled={!isAvailable}
            onPress={handleStartSurvey}
          >
            <Text 
              className={isAvailable 
                ? "text-primary text-lg font-bold" 
                : "text-muted-foreground text-lg"
              }
            >
              {isAvailable 
                ? t('home.startSurvey')
                : formatSurveyTime(nextTime, t)
              }
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
