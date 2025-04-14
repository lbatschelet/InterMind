/**
 * @packageDocumentation
 * @module Components/QuestionTypes
 * 
 * @summary
 * Multiple-choice question component.
 * 
 * @remarks
 * - Allows users to select **multiple** options.
 * - Updates the parent component only when options change.
 */

import React, { useState } from "react";
import { View } from "react-native";
import type { QuestionComponentProps } from "~/src/types/question";
import { createLogger } from "~/src/utils/logger";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

const log = createLogger("MultipleChoice");

/**
 * Multiple-choice question component.
 * 
 * @component
 * @param {QuestionComponentProps<"multiple_choice">} props - Component props.
 * @param {object} props.question - The question data.
 * @param {function} props.onNext - Function to submit the selected answers.
 */
const MultipleChoice: React.FC<QuestionComponentProps<"multiple_choice">> = ({ question, onNext }) => {
  // Track selected options
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  /**
   * Toggles selection of an option.
   * @param {string} option - The option to toggle.
   */
  const handleSelect = (option: string) => {
    const newSelection = selectedOptions.includes(option)
      ? selectedOptions.filter(o => o !== option)
      : [...selectedOptions, option];
    
    setSelectedOptions(newSelection);
    log.debug("Selection updated", { questionId: question.id, selectedOptions: newSelection });
    
    // Send updated selection to parent component
    onNext(newSelection);
  };

  return (
    <View className="space-y-4">
      {question.options.map(({ value, label }) => (
        <Button
          key={value}
          variant={selectedOptions.includes(value) ? "default" : "outline"}
          onPress={() => handleSelect(value)}
        >
          <Text>{label}</Text>
        </Button>
      ))}
    </View>
  );
};

export default MultipleChoice;
