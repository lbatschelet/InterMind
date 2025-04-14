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
import { ScrollView, View } from "react-native";
import Markdown from 'react-native-markdown-display';
import type { QuestionComponentProps } from "~/src/types/question";
import { Text } from "../ui/text";

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
  // Check if text contains markdown formatting
  const hasMarkdown = /[*#_\-`]/.test(question.text);

  return (
    <View className="space-y-2 max-h-96">
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {hasMarkdown ? (
          <Markdown style={{
            body: { fontSize: 16, lineHeight: 24 },
            heading1: { fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
            heading2: { fontSize: 20, fontWeight: 'bold', marginVertical: 8 },
            heading3: { fontSize: 18, fontWeight: 'bold', marginVertical: 6 },
            bullet_list: { marginVertical: 8 },
            ordered_list: { marginVertical: 8 },
            paragraph: { marginVertical: 6 },
            strong: { fontWeight: 'bold' },
            em: { fontStyle: 'italic' },
            link: { color: '#0077CC', textDecorationLine: 'underline' }
          }}>
            {question.text}
          </Markdown>
        ) : (
          <Text className="text-base">{question.text}</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default InfoScreen; 