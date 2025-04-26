import React from "react";
import { Dimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/src/components/ui/text";
import { Button } from "~/src/components/ui/button";
import { useLanguage } from "~/src/contexts/LanguageContext";
import { SvgRegistry } from "~/src/lib/images";

// Screen dimensions for responsive design
const { width } = Dimensions.get('window');

/**
 * Props for the ErrorScreen component
 */
interface ErrorScreenProps {
  /** Custom title to display (optional) */
  title?: string;
  /** Custom description to display (optional) */
  description?: string;
  /** Custom button text (optional) */
  buttonText?: string;
  /** Custom image key from SvgRegistry (optional, defaults to 'page-not-found') */
  imageKey?: keyof typeof SvgRegistry;
  /** Action to perform when the button is clicked */
  onAction: () => void;
}

/**
 * Error Screen Component
 * 
 * Displays an error message with an image and action button.
 * 
 * @param props - Component props
 * @returns Error screen with image, text and action button
 */
const ErrorScreen: React.FC<ErrorScreenProps> = ({ 
  title,
  description,
  buttonText,
  imageKey = 'page-not-found',
  onAction
}) => {
  const { t } = useLanguage();
  const ErrorImage = SvgRegistry[imageKey];

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center p-6">
        <ErrorImage width={width * 0.7} height={width * 0.7} />
        <Text className="text-xl font-bold text-primary mt-8 text-center">
          {title || t('general.error') || 'Something went wrong'}
        </Text>
        {description && (
          <Text className="text-sm text-muted-foreground mt-2 text-center mb-6">
            {description}
          </Text>
        )}
        <Button 
          variant="default" 
          className="bg-accent w-full"
          onPress={onAction}
        >
          <Text className="text-primary text-lg font-bold">
            {buttonText || t('general.goBack') || 'Go Back'}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default ErrorScreen; 