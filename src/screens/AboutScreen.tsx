/**
 * @packageDocumentation
 * @module Screens/About
 * 
 * @summary
 * About screen that provides information about the application.
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
import { platformStyles } from "~/src/styles/platformStyles";

const log = createLogger("AboutScreen");

/**
 * About Screen Component
 */
const AboutScreen: React.FC = () => {
  const { t } = useLanguage();
  const screenHeight = Dimensions.get('window').height;
  
  // Content for the about screen - could be moved to translation files
  const aboutTitle = t('about.title');
  const aboutContent = t('about.content');
  
  // Get the SVG component from the registry
  const EverydayDesign = SvgRegistry['everyday-design'];
  
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView className={`flex-1 px-4 ${platformStyles.contentScrollViewMarginTop}`}>
          {/* App Logo/Image at top - reduced even further */}
          <View className={`items-center mb-2 ${platformStyles.headerImageMarginTop}`}>
            <EverydayDesign 
              height={getImageHeight(screenHeight, 0.2)}
              width="100%"
            />
          </View>
          
          {/* Directly show the markdown content without duplicating the title */}
          <Markdown style={markdownStyles}>
            {aboutContent}
          </Markdown>
          
          {/* Bottom padding */}
          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AboutScreen; 