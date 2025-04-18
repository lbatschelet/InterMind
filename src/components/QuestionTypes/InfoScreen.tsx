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
 *   '{"buttonText": "I understand"}',
 *   'demographic_intro'
 * );
 */

import React, { useEffect } from "react";
import { Dimensions, Text, View, StyleSheet } from "react-native";
import type { QuestionComponentProps } from "~/src/types/question";
import QuestionImage from "../QuestionImage";
import Markdown from 'react-native-markdown-display';
import { getImageHeight, INFO_SCREEN_LAYOUT, markdownStyles as sharedMarkdownStyles } from "~/src/styles/infoScreenStyles";

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
  
  // Der Button-Text sollte aus den Optionen kommen (oder als Fallback genutzt werden)
  const buttonText = question.buttonText || "general.continue";
  
  // Stellen wir sicher, dass der onNext-Handler verfügbar ist für den "Next"-Button
  useEffect(() => {
    // Rufe onNext einmal beim Rendern auf, um sicherzustellen, dass die Komponente initialisiert ist
    if (onNext) {
      // Übergebe keine Parameter, da onNext keine erwartet
      onNext();
    }
  }, [onNext]);
  
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