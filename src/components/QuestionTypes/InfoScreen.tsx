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
import { Dimensions, ScrollView, Text, View, StyleSheet } from "react-native";
import type { QuestionComponentProps } from "~/src/types/question";
import QuestionImage from "../QuestionImage";

// Konstante Werte für Layout-Abstände und Größen
const LAYOUT = {
  PADDING_HORIZONTAL: 16,
  PADDING_TOP: 8,
  IMAGE_HEIGHT_PERCENT: 0.2,    // 20% der Bildschirmhöhe für Bilder
  PLACEHOLDER_HEIGHT_PERCENT: 0.05, // 5% der Bildschirmhöhe für Platzhalter
  TITLE_FONT_SIZE: 28,
  TITLE_MARGIN_BOTTOM: 24,
  TEXT_FONT_SIZE: 16,
  TEXT_LINE_HEIGHT: 24,
  BOTTOM_PADDING: 200  // Großes Padding unten für Scroll hinter Buttons
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
  
  // Stellen wir sicher, dass der onNext-Handler verfügbar ist für den "Next"-Button
  useEffect(() => {
    // Rufe onNext einmal beim Rendern auf, um sicherzustellen, dass die Komponente initialisiert ist
    if (onNext) {
      onNext();
    }
  }, [onNext]);
  
  return (
    <View style={styles.container}>
      {/* Reservierter Platz für das Bild - entweder mit Bild oder als leerer Platzhalter */}
      <View style={styles.imageContainer}>
        {question.imageSource ? (
          <QuestionImage 
            imageSource={question.imageSource} 
            imageHeight={screenHeight * LAYOUT.IMAGE_HEIGHT_PERCENT}
          />
        ) : (
          // Leerer Platzhalter mit geringerer Höhe, wenn kein Bild vorhanden ist
          <View style={{ height: screenHeight * LAYOUT.PLACEHOLDER_HEIGHT_PERCENT }} />
        )}
      </View>
      
      {/* Scrollbarer Bereich - nimmt den übrigen Platz ein */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
        persistentScrollbar={true}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
        alwaysBounceVertical={true}
        decelerationRate="normal"
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        overScrollMode="always"
        scrollToOverflowEnabled={true}
        directionalLockEnabled={true}
      >
        {/* Titel innerhalb der ScrollView */}
        <Text style={styles.title}>
          {question.title}
        </Text>
        
        {/* Text direkt nach dem Titel */}
        <Text style={styles.text}>
          {question.text}
        </Text>
      </ScrollView>
    </View>
  );
};

// Styles für bessere Lesbarkeit ausgelagert
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: LAYOUT.PADDING_HORIZONTAL,
    paddingTop: LAYOUT.PADDING_TOP,
    overflow: 'hidden'
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
    width: '100%'
  },
  scrollView: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  scrollContent: {
    paddingBottom: LAYOUT.BOTTOM_PADDING,
    flexGrow: 1,
    width: '100%'
  },
  title: {
    fontSize: LAYOUT.TITLE_FONT_SIZE,
    fontWeight: 'bold',
    marginBottom: LAYOUT.TITLE_MARGIN_BOTTOM,
    textAlign: 'left'
  },
  text: {
    fontSize: LAYOUT.TEXT_FONT_SIZE,
    lineHeight: LAYOUT.TEXT_LINE_HEIGHT
  }
});

export default InfoScreen; 