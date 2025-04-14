/**
 * @packageDocumentation
 * @module Components/QuestionTypes
 * 
 * @summary
 * Single-choice question component.
 * 
 * @remarks
 * - Allows the user to select **one** option.
 * - Supports **AutoAdvance**: Automatically navigates forward when an option is selected (only the first time).
 * - The actual navigation is handled by `SurveyScreen.tsx`.
 */

import React, { useRef, useState } from "react";
import { View } from "react-native";
import type { QuestionComponentProps } from "~/src/types/question";
import { createLogger } from "~/src/utils/logger";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

const log = createLogger("SingleChoice");

/**
 * Single-choice question component.
 * 
 * @component
 * @param {QuestionComponentProps<"single_choice">} props - Component props.
 * @param {object} props.question - The question data.
 * @param {function} props.onNext - Function to submit the selected answer.
 * @param {function} props.onAutoAdvance - Optional callback to trigger navigation.
 */
const SingleChoice: React.FC<QuestionComponentProps<"single_choice"> & { onAutoAdvance?: () => void }> = ({ 
  question, 
  onNext,
  onAutoAdvance
}) => {
  // Track the selected option
  const [selected, setSelected] = useState<string | null>(null);

  // Ensures AutoAdvance only triggers **once**
  const autoAdvanceTriggered = useRef(false);

  /**
   * Handles option selection.
   * @param {string} value - The selected option.
   */
  const handleSelect = (value: string) => {
    setSelected(value);
    log.debug("User selected an option", { questionId: question.id, value });

    // Always submit the response
    onNext(value);

    // AutoAdvance: Only trigger if enabled and it's the first time
    if (question.autoAdvance && !autoAdvanceTriggered.current && onAutoAdvance) {
      log.debug("AutoAdvance activated, navigating forward", { questionId: question.id });
      autoAdvanceTriggered.current = true; // Mark that AutoAdvance has been triggered
      onAutoAdvance(); // Trigger navigation through the callback
    }
  };

  return (
    <View className="space-y-4">
      {question.options.map(({ value, label }) => (
        <Button
          key={value}
          variant={selected === value ? "default" : "outline"}
          onPress={() => handleSelect(value)}
        >
          <Text>{label}</Text>
        </Button>
      ))}
    </View>
  );
};

export default SingleChoice;
