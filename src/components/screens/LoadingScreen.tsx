import React from "react";
import { Dimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/src/components/ui/text";
import { useLanguage } from "~/src/contexts/LanguageContext";
import { SvgRegistry } from "~/src/lib/images";

// Screen dimensions for responsive design
const { width } = Dimensions.get('window');

/**
 * Props for the LoadingScreen component
 */
interface LoadingScreenProps {
  /** Custom title to display (optional) */
  title?: string;
  /** Custom description to display (optional) */
  description?: string;
}

/**
 * Loading Screen Component
 * 
 * Displays a loading animation with text while content is being loaded.
 * 
 * @param props - Component props
 * @returns Loading screen with animation and text
 */
const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  title,
  description
}) => {
  const { t } = useLanguage();
  const LoadingImage = SvgRegistry['loading'];

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-6">
        <LoadingImage width={width * 0.7} height={width * 0.7} />
        <Text className="text-xl font-bold text-primary mt-8 text-center">
          {title || t('general.loading') || 'Loading...'}
        </Text>
        {description && (
          <Text className="text-sm text-muted-foreground mt-2 text-center">
            {description}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LoadingScreen; 