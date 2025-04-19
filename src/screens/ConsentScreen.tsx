/**
 * @packageDocumentation
 * @module Screens/Consent
 * 
 * @summary
 * Consent screen that provides information about data usage and consent.
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

const log = createLogger("ConsentScreen");

/**
 * Consent Screen Component
 */
const ConsentScreen: React.FC = () => {
  const { t } = useLanguage();
  const screenHeight = Dimensions.get('window').height;
  
  // Content for the consent screen from translation files
  const consentContent = t('consent.content');
  
  // Get the SVG component from the registry - using contract image
  const Contract = SvgRegistry['contract'];
  
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView className="flex-1 px-4 -mt-16">
          {/* Consent Image at top */}
          <View className="items-center mt-0 mb-2">
            <Contract 
              height={getImageHeight(screenHeight, 0.2)}
              width="100%"
            />
          </View>
          
          {/* Markdown content with title included in the markdown */}
          <Markdown style={markdownStyles}>
            {consentContent}
          </Markdown>
          
          {/* Bottom padding */}
          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ConsentScreen; 