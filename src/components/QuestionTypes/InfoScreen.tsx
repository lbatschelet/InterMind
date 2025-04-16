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

import React from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
import type { QuestionComponentProps } from "~/src/types/question";

/**
 * Information screen component.
 * 
 * @component
 * @param {QuestionComponentProps<"info_screen">} props - Component props.
 * @param {object} props.question - The info screen data.
 */
const InfoScreen: React.FC<QuestionComponentProps<"info_screen">> = ({ 
  question
}) => {
  // Berechne eine bessere Höhe für die ScrollView
  const screenHeight = Dimensions.get('window').height;
  // Bildschirmhöhe für den scrollbaren Bereich, mit Spielraum für Button und Titel
  const scrollViewHeight = screenHeight * 0.6;
  
  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 100, paddingBottom: 20 }}>
      {/* Title */}
      <Text style={{ 
        fontSize: 28, 
        fontWeight: 'bold', 
        marginBottom: 24, 
        textAlign: 'left' 
      }}>
        {question.title}
      </Text>
      
      {/* Content - Scrollbare Textdarstellung */}
      <View style={{ 
          height: scrollViewHeight, 
          borderWidth: 0,
          marginBottom: 20
        }}>
        <ScrollView 
          showsVerticalScrollIndicator={true}
          indicatorStyle="black"
          persistentScrollbar={true}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          <Text style={{ fontSize: 16, lineHeight: 24 }}>
            {question.text}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default InfoScreen; 