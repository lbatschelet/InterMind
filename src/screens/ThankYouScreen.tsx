import React from "react";
import { Dimensions, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/src/components/ui/button";
import { Text } from "~/src/components/ui/text";
import { H1 } from "~/src/components/ui/typography";
import { useLanguage } from "~/src/contexts/LanguageContext";
import { SvgRegistry } from "~/src/lib/images";
import { createLogger } from "~/src/utils/logger";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "~/src/navigation/AppNavigator";

const log = createLogger("ThankYouScreen");

/** Screen width for responsive display */
const { width } = Dimensions.get("window");

/** Navigation prop type for the ThankYou screen */
type ThankYouScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "ThankYou">;

/** Props for the ThankYou screen component */
interface ThankYouScreenProps {
  /** Navigation object from React Navigation */
  navigation: ThankYouScreenNavigationProp;
}

/**
 * ThankYou Screen Component
 *
 * This screen is shown after all survey slots have been completed.
 * It thanks the participant for their participation and explains that
 * the survey period has ended.
 */
const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ navigation }) => {
  const { t } = useLanguage();
  
  // Get the SVG component from the registry
  const ThankYouIllustration = SvgRegistry["super-thank-you"];

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <SafeAreaView edges={["top"]} className="flex-1">
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

        {/* Centered SVG */}
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ThankYouIllustration width={width * 0.6} />
        </View>

        <H1 className="text-center text-primary mt-8 font-bold">
          {t('thankyou.title')}
        </H1>

        {/* Message */}
        <View className="px-6 pb-6">
          <Text className="text-center text-primary text-lg mb-32">
            {t('thankyou.message')}
          </Text>
        </View>

      </SafeAreaView>
    </View>
  );
};

export default ThankYouScreen; 