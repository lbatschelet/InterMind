/**
 * @packageDocumentation
 * @module Components/QuestionTypes
 * 
 * @summary
 * Information screen component for displaying explanatory text between questions.
 * 
 * @remarks
 * - Used for onboarding, instructions, or contextual information.
 * - Not an actual question, but follows the same flow pattern.
 * - Supports markdown for rich text formatting.
 * - Handles scrollable content for longer texts.
 * - Can trigger permission requests or other callbacks when proceeding
 * 
 * @example
 * // SQL statement to insert a new info screen with markdown into the database:
 * INSERT INTO questions (type, title, text, options, category) VALUES (
 *   'info_screen',
 *   'Data Privacy Information',
 *   '## Privacy Information
 *   
 *   We are collecting demographic data to better understand our user base.
 *   
 *   **All data is anonymized** and you can delete it at any time.
 *   
 *   - First important point
 *   - Second important point
 *   - Third important point',
 *   '{"buttonText": "I understand", "action": "request_notification_permission"}',
 *   'demographic_intro'
 * );
 */

import React, { useEffect } from "react";
import { Dimensions, Text, View, StyleSheet } from "react-native";
import type { QuestionComponentProps } from "~/src/types/question";
import QuestionImage from "../ui/question-image";
import Markdown from 'react-native-markdown-display';
import { getImageHeight, INFO_SCREEN_LAYOUT, markdownStyles as sharedMarkdownStyles } from "~/src/styles/infoScreenStyles";
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { createLogger } from "~/src/utils/logger";
import { useLanguage } from "~/src/contexts/LanguageContext";

const log = createLogger("InfoScreen");

// Define possible actions that can be executed when proceeding
type InfoScreenAction = 
  | 'request_notification_permission' 
  | 'request_location_permission'
  | null;

/**
 * Executes a specific action based on the action parameter
 * @param action The action to execute
 * @returns Promise<boolean> true if the action was successful
 */
export const executeAction = async (action: InfoScreenAction): Promise<boolean> => {
  if (!action) return true;
  
  log.debug(`executeAction called with action: ${action}`);
  
  switch (action) {
    case 'request_notification_permission':
      try {
        log.info('Starting notification permission request...');
        
        // First check the current status
        const currentStatus = await Notifications.getPermissionsAsync();
        log.debug(`Current notification permission status: ${currentStatus.status}`);
        
        // Only request if not already granted
        if (currentStatus.status !== 'granted') {
          log.debug('Permission not granted yet, requesting...');
          const { status } = await Notifications.requestPermissionsAsync({
            ios: { allowAlert: true, allowBadge: true, allowSound: true }
          });
          const granted = status === 'granted';
          log.info(`Notification permission ${granted ? 'granted' : 'denied'}`);
          return granted;
        } else {
          log.info('Notification permission already granted');
          return true;
        }
      } catch (error) {
        log.error('Error requesting notification permission', error);
        return false;
      }
      
    case 'request_location_permission':
      try {
        log.info('Starting location permission request...');
        
        // First check the current status
        const currentStatus = await Location.getForegroundPermissionsAsync();
        log.debug(`Current location permission status: ${currentStatus.status}`);
        
        // Only request if not already granted
        if (currentStatus.status !== 'granted') {
          log.debug('Permission not granted yet, requesting...');
          const { status } = await Location.requestForegroundPermissionsAsync();
          const granted = status === 'granted';
          log.info(`Location permission ${granted ? 'granted' : 'denied'}`);
          return granted;
        } else {
          log.info('Location permission already granted');
          return true;
        }
      } catch (error) {
        log.error('Error requesting location permission', error);
        return false;
      }
      
    default:
      log.warn(`Unknown action: ${action}`);
      return true;
  }
};

/**
 * Information screen component.
 * 
 * @component
 * @param {QuestionComponentProps<"info_screen">} props - Component props.
 * @param {object} props.question - The info screen data.
 * @param {Function} props.onNext - Callback function for the next button.
 */
const InfoScreen: React.FC<QuestionComponentProps<"info_screen">> = ({ 
  question,
  onNext
}) => {
  // Calculate dimensions for responsive elements
  const screenHeight = Dimensions.get('window').height;
  
  // Parse the action from question options (if present)
  const action = question.options?.action as InfoScreenAction || null;
  
  // Debug log for what exactly this InfoScreen has
  useEffect(() => {
    log.info("InfoScreen rendered", {
      title: question.title,
      hasAction: !!action,
      action: action
    });
  }, [question, action]);
  
  // For normal info screens without actions: automatically advance
  useEffect(() => {
    // Only for normal info screens without actions: automatically advance
    if (!action && onNext) {
      log.info("InfoScreen without action - auto-advancing");
      onNext();
    } else if (action) {
      log.info("InfoScreen with action - waiting for button click");
    }
  }, [onNext, action]);
  
  // For info screens with permission actions:
  // The action is executed in the SurveyScreen when clicking the "Continue" button
  // by calling the onNext function.
  // Here we only define the user interface.
  
  const { t } = useLanguage();
  
  return (
    <View style={styles.container}>
      {/* Image always first, if available */}
      {question.imageSource && (
        <View style={styles.imageContainer}>
          <QuestionImage 
            imageSource={question.imageSource} 
            imageHeight={getImageHeight(screenHeight)}
          />
        </View>
      )}
      
      {/* Title after the image */}
      <Text style={styles.title}>
        {question.title}
      </Text>
      
      {/* Markdown formatted text */}
      <Markdown style={markdownStyles}>
        {question.text}
      </Markdown>
    </View>
  );
};

// Styles extracted for better readability
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8  // More vertical spacing
  },
  title: {
    fontSize: INFO_SCREEN_LAYOUT.TITLE_FONT_SIZE,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: INFO_SCREEN_LAYOUT.TITLE_MARGIN_BOTTOM,
    textAlign: 'left'
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,  // Slightly more spacing below
    width: '100%'
  },
  actionButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10
  },
  actionButton: {
    backgroundColor: '#007AFF',
    color: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    overflow: 'hidden',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

// We use the shared markdown styles, but add specific adjustments here
const markdownStyles = {
  ...sharedMarkdownStyles,
  // Special adjustments for InfoScreen:
  body: {
    ...sharedMarkdownStyles.body,
    marginBottom: 0, // No additional padding at the bottom, as SurveyScreen already has padding
  }
};

export default InfoScreen; 