import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
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
    
    log.info("Starting a new survey session...");
    const success = await startSurvey(language);
    
    if (success) {
      log.info("Survey session started, navigating to survey screen");
      navigation.navigate("SurveyScreen");
    }
  };

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
