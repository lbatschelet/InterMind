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
 * - Supports multi-line text in options.
 * - Provides scrollable option list when needed.
 */

import React, { useEffect, useRef, useState } from "react";
import type { QuestionComponentProps } from "~/src/types/question";
import { createLogger } from "~/src/utils/logger";
import OptionsSelector from "./OptionsSelector";

const log = createLogger("MultipleChoice");

/**
 * Multiple-choice question component.
 * 
 * @component
 * @param {QuestionComponentProps<"multiple_choice">} props - Component props.
 * @param {object} props.question - The question data.
 * @param {function} props.onNext - Function to submit the selected answers.
 * @param {string[]} props.initialValue - Optional initial values for previously answered questions.
 */
const MultipleChoice: React.FC<QuestionComponentProps<"multiple_choice"> & {
  initialValue?: string[];
}> = ({ 
  question, 
  onNext,
  initialValue
}) => {
  // Track current question ID to prevent value leakage between questions
  const questionIdRef = useRef<string>(question.id);
  
  // Track selected options, initialized with previous selections if available
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    initialValue && questionIdRef.current === question.id ? initialValue : []
  );

  // Handle question changes and restore previous answers if needed
  useEffect(() => {
    // Reset state when question changes
    if (questionIdRef.current !== question.id) {
      log.debug("Question changed, resetting selections", {
        oldQuestionId: questionIdRef.current,
        newQuestionId: question.id
      });
      
      // Update question reference
      questionIdRef.current = question.id;
      
      // Reset selections for new question
      setSelectedOptions(initialValue || []);
      
      // Submit the initial value if one exists for this specific question
      if (initialValue && initialValue.length > 0) {
        log.debug("Using existing selections for new question", { 
          questionId: question.id, 
          selections: initialValue 
        });
        onNext(initialValue);
      }
    }
  }, [question.id, initialValue, onNext]);

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
    <OptionsSelector
      options={question.options}
      onSelect={handleSelect}
      selectedValues={selectedOptions}
      isMultipleChoice={true}
    />
  );
};

export default MultipleChoice;
