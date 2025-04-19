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
import QuestionImage from "../QuestionImage";
import Markdown from 'react-native-markdown-display';
import { getImageHeight, INFO_SCREEN_LAYOUT, markdownStyles as sharedMarkdownStyles } from "~/src/styles/infoScreenStyles";
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { createLogger } from "~/src/utils/logger";
import { useLanguage } from "~/src/contexts/LanguageContext";

const log = createLogger("InfoScreen");

// Definiere die möglichen Aktionen, die beim Fortfahren ausgeführt werden können
type InfoScreenAction = 
  | 'request_notification_permission' 
  | 'request_location_permission'
  | null;

/**
 * Führt eine spezifische Aktion aus, basierend auf dem action-Parameter
 * @param action Die auszuführende Aktion
 * @returns Promise<boolean> true, wenn die Aktion erfolgreich war
 */
export const executeAction = async (action: InfoScreenAction): Promise<boolean> => {
  if (!action) return true;
  
  log.debug(`executeAction called with action: ${action}`);
  
  switch (action) {
    case 'request_notification_permission':
      try {
        log.info('Starting notification permission request...');
        
        // Prüfe zuerst den aktuellen Status
        const currentStatus = await Notifications.getPermissionsAsync();
        log.debug(`Current notification permission status: ${currentStatus.status}`);
        
        // Nur anfragen, wenn nicht bereits erteilt
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
        
        // Prüfe zuerst den aktuellen Status
        const currentStatus = await Location.getForegroundPermissionsAsync();
        log.debug(`Current location permission status: ${currentStatus.status}`);
        
        // Nur anfragen, wenn nicht bereits erteilt
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
  // Berechne Dimensionen für responsive Elemente
  const screenHeight = Dimensions.get('window').height;
  
  // Parse die action aus den question options (falls vorhanden)
  const action = question.options?.action as InfoScreenAction || null;
  
  // Debug-Log, was genau dieser InfoScreen hat
  useEffect(() => {
    log.info("InfoScreen rendered", {
      title: question.title,
      hasAction: !!action,
      action: action
    });
  }, [question, action]);
  
  // Für normale Info-Screens ohne Aktionen: Automatisch weitergehen
  useEffect(() => {
    // Nur für normale Info-Screens ohne Aktionen: Automatisch weitergehen
    if (!action && onNext) {
      log.info("InfoScreen without action - auto-advancing");
      onNext();
    } else if (action) {
      log.info("InfoScreen with action - waiting for button click");
    }
  }, [onNext, action]);
  
  // Für Info-Screens mit Berechtigungsaktionen:
  // Die Aktion wird im SurveyScreen beim Klick auf den "Weiter"-Button
  // durch Aufruf der onNext-Funktion ausgeführt.
  // Hier definieren wir nur die Benutzeroberfläche.
  
  const { t } = useLanguage();
  
  return (
    <View style={styles.container}>
      {/* Bild immer zuerst, wenn vorhanden */}
      {question.imageSource && (
        <View style={styles.imageContainer}>
          <QuestionImage 
            imageSource={question.imageSource} 
            imageHeight={getImageHeight(screenHeight)}
          />
        </View>
      )}
      
      {/* Titel nach dem Bild */}
      <Text style={styles.title}>
        {question.title}
      </Text>
      
      {/* Markdown-formatierter Text */}
      <Markdown style={markdownStyles}>
        {question.text}
      </Markdown>
    </View>
  );
};

// Styles für bessere Lesbarkeit ausgelagert
const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8  // Mehr vertikaler Abstand
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
    marginBottom: 20,  // Etwas mehr Abstand nach unten
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

// Wir verwenden die gemeinsamen Markdown-Styles, aber fügen hier spezifische Anpassungen hinzu
const markdownStyles = {
  ...sharedMarkdownStyles,
  // Spezielle Anpassungen für InfoScreen:
  body: {
    ...sharedMarkdownStyles.body,
    marginBottom: 0, // Kein zusätzliches Padding unten, da der SurveyScreen bereits Padding hat
  }
};

export default InfoScreen; 