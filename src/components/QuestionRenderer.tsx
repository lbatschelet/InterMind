/**
 * @packageDocumentation
 * @module Components
 * 
 * @summary
 * Renders the appropriate question component based on the question type.
 * 
 * @remarks
 * This component acts as a factory/dispatcher that:
 * - Dynamically selects the correct question type component
 * - Ensures type safety for response handling
 * - Passes initial values when navigating back to previously answered questions
 * - Handles auto-advance functionality
 */

import React, { useRef, useEffect } from "react";
import { Text } from "react-native";
import { createLogger } from "~/src/utils/logger";
import { Question } from "../types/question";
import InfoScreen from "./QuestionTypes/InfoScreen";
import MultipleChoice from "./QuestionTypes/MultipleChoice";
import SingleChoice from "./QuestionTypes/SingleChoice";
import { SliderQuestion } from "./QuestionTypes/Slider";
import TextInputQuestion from "./QuestionTypes/TextInput";

const log = createLogger("QuestionRenderer");

/**
 * Renders the appropriate UI component for a given question.
 *
 * @param props - Component props
 * @param props.question - The question object containing type and content
 * @param props.onNext - Callback function for when the question is answered
 * @param props.onAutoAdvance - Optional callback for auto-advancing to the next question
 * @param props.initialValue - Optional initial value for previously answered questions
 * @returns The appropriate question component based on the question type
 */
const QuestionRenderer = ({ 
  question, 
  onNext,
  onAutoAdvance,
  initialValue
}: { 
  question: Question;
  onNext: (response: string | string[] | number | void) => void;
  onAutoAdvance?: () => void;
  initialValue?: unknown;
}) => {
  // Ref to track if we've already logged this question, to prevent duplicate logs
  const hasLoggedRef = useRef(false);
  
  // Only log once per question instance
  useEffect(() => {
    if (!hasLoggedRef.current) {
      log.debug("Rendering question", { question, hasInitialValue: !!initialValue });
      hasLoggedRef.current = true;
    }
  }, [question, initialValue]);

  switch (question.type) {
    case "single_choice":
      return <SingleChoice 
        question={question} 
        onNext={onNext as (value: string) => void} 
        onAutoAdvance={onAutoAdvance}
        initialValue={initialValue as string}
      />;

    case "multiple_choice":
      return <MultipleChoice 
        question={question} 
        onNext={onNext as (value: string[]) => void}
        initialValue={initialValue as string[]}
      />;

    case "slider":
      return <SliderQuestion 
        question={question} 
        onNext={onNext as (value: number) => void}
        initialValue={initialValue as number}
      />;

    case "text":
      return <TextInputQuestion 
        question={question} 
        onNext={onNext as (value: string) => void}
        initialValue={initialValue as string}
      />;
      
    case "info_screen":
      return <InfoScreen
        question={question}
        onNext={() => {
          const shouldLog = !hasLoggedRef.current;
          if (shouldLog) {
            log.debug("InfoScreen onNext callback triggered");
          }
          onNext();
        }}
      />;

    default:
      log.error("Unknown question type", question);
      return <Text>Error: Unknown question type</Text>;
  }
};

// Use React.memo to prevent unnecessary rerenders
export default React.memo(QuestionRenderer);
