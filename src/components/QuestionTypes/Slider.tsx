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
 */

import Slider from "@react-native-community/slider";
import React, { useState } from "react";
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
 */
export const SliderQuestion: React.FC<QuestionComponentProps<"slider">> = ({ question, onNext }) => {
  // Validate input values
  if (!question?.options?.values || question.options.values.length < 2) {
    log.error("Invalid question data", { question });
    return null; // Prevent rendering if data is malformed
  }

  // Extract labels safely
  const labels = question.options.values;
  const minLabel = labels[0] ?? "Min"; // Default fallback
  const maxLabel = labels[labels.length - 1] ?? "Max"; // Default fallback

  // Track user selection (default to center position)
  const [selectedValue, setSelectedValue] = useState<number>(0.5);

  // Update parent component with current value
  const handleValueChange = (value: number) => {
    setSelectedValue(value);
    log.debug("Slider value updated", { questionId: question.id, value });
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
