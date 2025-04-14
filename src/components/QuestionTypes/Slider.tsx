/**
 * @packageDocumentation
 * @module Components/QuestionTypes
 * 
 * @summary
 * Smooth slider question component with labeled endpoints.
 * 
 * @remarks
 * - Uses a continuous scale (0.0 → 1.0).
 * - Displays only labels, no numbers.
 * - The user must confirm the selection using the "Next" button in SurveyScreen.
 * 
 * @example
 * // SQL statement to insert a new slider question into the database:
 * INSERT INTO questions (type, text, options, category) VALUES (
 *   'slider',
 *   'How satisfied are you with the service?',
 *   '{"values": ["Dissatisfied", "Neutral", "Very satisfied"]}',
 *   'feedback'
 * );
 * 
 * // Explanation:
 * // - The type must be 'slider'
 * // - options must be a JSONB with a "values" array
 * // - The values array should have minimum 2 entries (min and max labels) and maximum 3 entries
 * // - For 3 values: first is min, second is neutral/middle, third is max
 * // - The component displays only the min and max labels on the UI
 */

import Slider from "@react-native-community/slider";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import type { QuestionComponentProps } from "~/src/types/question";
import { createLogger } from "~/src/utils/logger";

const log = createLogger("SliderQuestion");

/**
 * Smooth slider question component.
 * 
 * @component
 * @param {QuestionComponentProps<"slider">} props - Component props.
 * @param {object} props.question - The question data.
 * @param {function} props.onNext - Function to submit the selected slider value.
 * @param {number} props.initialValue - Optional initial value for previously answered questions.
 */
export const SliderQuestion: React.FC<QuestionComponentProps<"slider"> & {
  initialValue?: number;
}> = ({ 
  question, 
  onNext,
  initialValue
}) => {
  // Validate input values
  if (!question?.options?.values || question.options.values.length < 2) {
    log.error("Invalid question data", { question });
    return null; // Prevent rendering if data is malformed
  }

  // Extract labels safely
  const labels = question.options.values;
  const minLabel = labels[0] ?? "Min"; // Default fallback
  const maxLabel = labels[labels.length - 1] ?? "Max"; // Default fallback

  // Track current question ID to prevent value leakage between questions
  const questionIdRef = useRef<string>(question.id);
  
  // Track user selection (default to center position or previous value)
  const [selectedValue, setSelectedValue] = useState<number>(
    initialValue !== undefined && questionIdRef.current === question.id
      ? initialValue 
      : 0.5
  );

  // Update the question ID ref and reset value if question changes
  useEffect(() => {
    if (questionIdRef.current !== question.id) {
      log.debug("Question changed, resetting slider state", { 
        oldQuestionId: questionIdRef.current,
        newQuestionId: question.id
      });
      
      questionIdRef.current = question.id;
      
      // Use initialValue for this specific question or default to center
      setSelectedValue(initialValue !== undefined ? initialValue : 0.5);
      
      // Only submit the initial value if it exists for this question
      if (initialValue !== undefined) {
        log.debug("Using existing value for new question", { 
          questionId: question.id,
          value: initialValue
        });
        onNext(initialValue);
      }
    }
  }, [question.id, initialValue, onNext]);

  // Update parent component with current value
  const handleValueChange = (value: number) => {
    setSelectedValue(value);
    log.debug("Slider value updated", { questionId: question.id, value });
    
    // Send updated value to parent component
    onNext(value);
  };

  return (
    <View className="space-y-6">
      {/* Slider component */}
      <Slider
        minimumValue={0}
        maximumValue={1}
        step={undefined}
        value={selectedValue}
        onValueChange={handleValueChange}
        minimumTrackTintColor="#2196F3"
        maximumTrackTintColor="#BDBDBD"
        thumbTintColor="#2196F3"
      />

      {/* Labels on both sides */}
      <View className="flex-row justify-between px-4">
        <Text className="text-lg">{minLabel}</Text>
        <Text className="text-lg">{maxLabel}</Text>
      </View>
    </View>
  );
};

export default SliderQuestion;
