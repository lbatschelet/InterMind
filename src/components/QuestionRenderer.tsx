import React from "react";
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
 * - Dynamically selects the correct question type.
 * - Ensures type safety for `onNext` responses.
 * - Can restore previous answers when navigating back.
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
  log.debug("Rendering question", { question, hasInitialValue: !!initialValue });

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
        onNext={() => onNext()} // Info screens don't return a value
      />;

    default:
      log.error("Unknown question type", question);
      return <Text>Error: Unknown question type</Text>;
  }
};

export default QuestionRenderer;
