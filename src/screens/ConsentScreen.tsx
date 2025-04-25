/**
 * @packageDocumentation
 * @module Screens/Consent
 * 
 * @summary
 * Consent screen that provides information about data usage and consent.
 */

import React, { useState, useEffect } from "react";
import { ActivityIndicator, Dimensions, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from 'react-native-markdown-display';
import { Text } from "~/src/components/ui/text";
import { useLanguage } from "~/src/contexts/LanguageContext";
import { createLogger } from "~/src/utils/logger";
import { SvgRegistry } from "~/src/lib/images";
import { getImageHeight, infoScreenStyles, markdownStyles } from "~/src/styles/infoScreenStyles";
import { platformStyles } from "~/src/styles/platformStyles";
import { screenContentRepository } from "~/src/repositories/survey";
import { ScreenContent } from "~/src/repositories/interfaces/IScreenContentRepository";
import ErrorScreen from "~/src/components/screens/ErrorScreen";
import { useNavigation } from "@react-navigation/native";

const log = createLogger("ConsentScreen");

/**
 * Consent Screen Component
 */
const ConsentScreen: React.FC = () => {
  const { language, t } = useLanguage();
  const screenHeight = Dimensions.get('window').height;
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<ScreenContent | null>(null);
  const [error, setError] = useState(false);
  const navigation = useNavigation();
  
  // Fetch content from the database when the screen loads or language changes
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Get the consent content from the repository
        const consentContent = await screenContentRepository.getScreenContent('consent', language);
        
        if (consentContent) {
          setContent(consentContent);
        } else {
          // No content found in database
          log.error("No consent content found in database");
          setError(true);
        }
      } catch (error) {
        log.error("Error loading consent content", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [language]);
  
  // Handle going back when there's an error
  const handleGoBack = () => {
    navigation.goBack();
  };
  
  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  if (error || !content) {
    return (
      <ErrorScreen
        title={t('errors.contentNotFound')}
        description={t('errors.contentLoadFailed')}
        buttonText={t('general.goBack')}
        imageKey="page-not-found"
        onAction={handleGoBack}
      />
    );
  }
  
  // Get the SVG component from the registry based on content
  const ImageComponent = content.imageKey && content.imageKey in SvgRegistry ? 
    SvgRegistry[content.imageKey as keyof typeof SvgRegistry] : 
    SvgRegistry['contract'];
  
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView className={`flex-1 px-4 ${platformStyles.contentScrollViewMarginTop}`}>
          {/* Consent Image at top */}
          <View className={`items-center mb-2 ${platformStyles.headerImageMarginTop}`}>
            {ImageComponent && (
              <ImageComponent 
                height={getImageHeight(screenHeight, 0.2)}
                width="100%"
              />
            )}
          </View>
          
          {/* Show the markdown content */}
          <Markdown style={markdownStyles}>
            {content.content || ''}
          </Markdown>
          
          {/* Bottom padding */}
          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ConsentScreen; 