import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Dimensions, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ADayAtThePark from "~/assets/a-day-at-the-park.svg";
import { Button } from "~/src/components/ui/button";
import { Text } from "~/src/components/ui/text";
import { RootStackParamList } from "~/src/navigation/AppNavigator";
import SurveyService from "../services/SurveyService";
import { createLogger } from "~/src/utils/logger";

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
  /** State to prevent double submissions */
  const [isCreatingSurvey, setIsCreatingSurvey] = useState(false);

  /**
   * Starts a new survey
   *
   * @remarks
   * Flow:
   * 1. Prevents double submission
   * 2. Creates new survey session
   * 3. Navigates to the SurveyScreen
   *
   * Error handling is managed by the respective services
   *
   * @returns Promise that resolves when the survey is created and navigation occurs
   */
  const handleStartSurvey = async () => {
    if (isCreatingSurvey) return;

    try {
      setIsCreatingSurvey(true);
      log.info("Starting a new survey session...");

      const { surveyId, questions } = await SurveyService.startSurvey();

      if (surveyId) {
        log.info("Survey session started", { surveyId });
        navigation.navigate("SurveyScreen");
      }
    } catch (error) {
      log.error("Failed to start survey", error);
    } finally {
      setIsCreatingSurvey(false);
    }
  };

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <SafeAreaView edges={["top"]} className="flex-1">
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

        {/* Centered SVG */}
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ADayAtThePark width={width * 0.8} height={width * 0.8} />
        </View>

        {/* Bottom Button */}
        <View className="w-full px-4 mb-12 items-center">
          <Button variant="default" className="bg-accent" onPress={handleStartSurvey}>
            <Text className="text-primary text-lg font-bold">Start Survey</Text>
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
