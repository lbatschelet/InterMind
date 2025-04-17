/**
 * @packageDocumentation
 * @module Screens/PrivacyPolicy
 * 
 * @summary
 * Privacy Policy screen that provides information about data privacy.
 */

import React from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from 'react-native-markdown-display';
import { Text } from "~/src/components/ui/text";
import { useLanguage } from "~/src/contexts/LanguageContext";
import { createLogger } from "~/src/utils/logger";
import { SvgRegistry } from "~/src/lib/images";
import { getImageHeight, infoScreenStyles, markdownStyles } from "~/src/styles/infoScreenStyles";

const log = createLogger("PrivacyPolicyScreen");

/**
 * Privacy Policy Screen Component
 */
const PrivacyPolicyScreen: React.FC = () => {
  const { t } = useLanguage();
  const screenHeight = Dimensions.get('window').height;
  
  // Content for the privacy policy screen - could be moved to translation files
  const privacyTitle = t('privacy.title');
  const privacyContent = t('privacy.content');
  
  // Get the SVG component from the registry
  const LocationSearch = SvgRegistry['location-search'];
  
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView className="flex-1 px-4 -mt-16">
          {/* Privacy Image at top - reduced even further */}
          <View className="items-center mt-0 mb-2">
            <LocationSearch 
              height={getImageHeight(screenHeight, 0.13)}
              width="100%"
            />
          </View>
          
          {/* Directly show the markdown content without duplicating the title */}
          <Markdown style={markdownStyles}>
            {privacyContent}
          </Markdown>
          
          {/* Bottom padding */}
          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default PrivacyPolicyScreen; 