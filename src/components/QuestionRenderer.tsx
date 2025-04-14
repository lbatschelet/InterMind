import React from "react";
import { Text } from "react-native";
import { createLogger } from "~/src/utils/logger";
import { Question } from "../types/question";
import MultipleChoice from "./QuestionTypes/MultipleChoice";
import SingleChoice from "./QuestionTypes/SingleChoice";
import { SliderQuestion } from "./QuestionTypes/Slider";
import TextInputQuestion from "./QuestionTypes/TextInput";

const log = createLogger("QuestionRenderer");

/**
 * Renders the appropriate UI component for a given question.
 * - Dynamically selects the correct question type.
 * - Ensures type safety for `onNext` responses.
 */
const QuestionRenderer = ({ 
  question, 
  onNext,
  onAutoAdvance  // Zusätzlicher Callback für Auto-Advance
}: { 
  question: Question;
  onNext: (response: string | string[] | number) => void;
  onAutoAdvance?: () => void;  // Optional für Abwärtskompatibilität
}) => {
  log.debug("Rendering question", question);

  switch (question.type) {
    case "single_choice":
      return <SingleChoice 
        question={question} 
        onNext={onNext as (value: string) => void} 
        onAutoAdvance={onAutoAdvance}
      />;

    case "multiple_choice":
      return <MultipleChoice question={question} onNext={onNext as (value: string[]) => void} />;

    case "slider":
      return <SliderQuestion question={question} onNext={onNext as (value: number) => void} />;

    case "text":
      return <TextInputQuestion question={question} onNext={onNext as (value: string) => void} />;

    default:
      log.error("Unknown question type", question);
      return <Text>Error: Unknown question type</Text>;
  }
};

export default QuestionRenderer;
