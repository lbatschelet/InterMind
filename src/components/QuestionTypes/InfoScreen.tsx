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

// Konstante Werte für Layout-Abstände und Größen
const LAYOUT = {
  IMAGE_HEIGHT_PERCENT: 0.2,    // 20% der Bildschirmhöhe für Bilder
  TITLE_FONT_SIZE: 28,
  TITLE_MARGIN_BOTTOM: 24,
  TEXT_FONT_SIZE: 16,
  TEXT_LINE_HEIGHT: 24
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
      {/* Bild immer zuerst, wenn vorhanden */}
      {question.imageSource && (
        <View style={styles.imageContainer}>
          <QuestionImage 
            imageSource={question.imageSource} 
            imageHeight={screenHeight * LAYOUT.IMAGE_HEIGHT_PERCENT}
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
    fontSize: LAYOUT.TITLE_FONT_SIZE,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: LAYOUT.TITLE_MARGIN_BOTTOM,
    textAlign: 'left'
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,  // Etwas mehr Abstand nach unten
    width: '100%'
  }
});

// Spezielle Styles für Markdown-Elemente
const markdownStyles = StyleSheet.create({
  // Basis-Textstil
  body: {
    fontSize: LAYOUT.TEXT_FONT_SIZE,
    lineHeight: LAYOUT.TEXT_LINE_HEIGHT,
    color: '#000',
    marginBottom: 0, // Kein zusätzliches Padding unten, da der SurveyScreen bereits Padding hat
  },
  // Überschriften
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  // Listen
  bullet_list: {
    marginVertical: 12,
  },
  ordered_list: {
    marginVertical: 12,
  },
  // Listenpunkte
  list_item: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  // Text innerhalb von Listenpunkten
  bullet_list_content: {
    flex: 1, // Erlaubt Textumbruch
  },
  ordered_list_content: {
    flex: 1, // Erlaubt Textumbruch
  },
  // Hervorhebungen
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  // Links
  link: {
    color: '#2196F3', // Standardmäßige Link-Farbe
    textDecorationLine: 'underline',
  },
  // Blockzitate
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#CCCCCC',
    paddingLeft: 8,
    marginLeft: 8,
    marginVertical: 8,
    fontStyle: 'italic',
  },
  // Code-Blöcke
  code_block: {
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 4,
    fontFamily: 'monospace',
    marginVertical: 8,
  },
  // Inlinie-Code
  code_inline: {
    backgroundColor: '#F5F5F5',
    fontFamily: 'monospace',
    padding: 2,
    borderRadius: 2,
  },
  // Horizontale Linien
  hr: {
    backgroundColor: '#CCCCCC',
    height: 1,
    marginVertical: 12,
  },
  // Bilder - angepasst an volle Breite mit responsiver Höhe
  image: {
    width: '100%',
    resizeMode: 'contain',
    marginVertical: 16,
    alignSelf: 'center',
  },
});

export default InfoScreen; 