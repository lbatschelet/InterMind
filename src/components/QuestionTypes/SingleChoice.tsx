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

import React, { useEffect, useRef, useState } from "react";
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
 * @param {string} props.initialValue - Optional initial value for previously answered questions.
 */
const SingleChoice: React.FC<QuestionComponentProps<"single_choice"> & { 
  onAutoAdvance?: () => void;
  initialValue?: string;
}> = ({ 
  question, 
  onNext,
  onAutoAdvance,
  initialValue
}) => {
  // Track current question ID to prevent value leakage between questions
  const questionIdRef = useRef<string>(question.id);
  
  // Track the selected option, initialized with previous answer if available
  const [selected, setSelected] = useState<string | null>(
    initialValue && questionIdRef.current === question.id ? initialValue : null
  );

  // Ensures AutoAdvance only triggers **once**
  const autoAdvanceTriggered = useRef(false);

  // Handle question changes and restore previous answers if needed
  useEffect(() => {
    // Reset state when question changes
    if (questionIdRef.current !== question.id) {
      log.debug("Question changed, resetting state", {
        oldQuestionId: questionIdRef.current,
        newQuestionId: question.id
      });
      
      // Update question reference
      questionIdRef.current = question.id;
      
      // Reset selection for new question
      setSelected(initialValue || null);
      
      // Reset auto-advance flag for new question
      autoAdvanceTriggered.current = false;
      
      // Submit the initial value if one exists for this specific question
      if (initialValue) {
        log.debug("Using existing value for new question", { 
          questionId: question.id, 
          value: initialValue 
        });
        onNext(initialValue);
      }
    }
  }, [question.id, initialValue, onNext]);

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
    <View className="w-full">
      <View className="space-y-6 w-full">
        {question.options.map(({ value, label }) => (
          <Button
            key={value}
            variant={selected === value ? "default" : "outline"}
            onPress={() => handleSelect(value)}
            className="py-3"
          >
            <Text>{label}</Text>
          </Button>
        ))}
      </View>
    </View>
  );
};

export default SingleChoice;
